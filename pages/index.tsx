import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';
import Alert from '../components/Alert';
import React, { useEffect, useState } from 'react';
import { isIOS, isSafari, isAndroid} from 'react-device-detect';
import usePassCount from "../src/hooks/use_pass_count";
import Link from 'next/link'

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);
    const passCount = usePassCount();    
    const displayPassCount = (passCount? `${passCount} receipts have been processed successfully to date!` : '');

    const [warningMessages, _setWarningMessages] = useState<Array<string>>([]);

    const setWarningMessage = (message: string) => {
        if (!message) return;

        const translation = t('errors:'.concat(message));
        _setWarningMessages(Array.from(new Set([...warningMessages, translation !== message ? translation : message])));
    };

    const deleteWarningMessage = (message: string) => _setWarningMessages(warningMessages.filter(item => item !== message));

    useEffect(() => {
        if (isIOS && !isSafari) setWarningMessage("iPhone users, only Safari is supported at the moment. Please switch to Safari to prevent any unexpected errors.")
        else if (!isIOS) {
                setWarningMessage('Only Safari on iOS is officially supported for Apple Wallet import at the moment - ' +
                    'for other platforms, please ensure you have an application which can open Apple Wallet .pkpass files');
        }
    }, []);
    

    // If you previously created a vaccination receipt before Sept. 23rd and need to add your date of birth on your vaccination receipt, please reimport your Ministry of Health official vaccination receipt again below and the date of birth will now be visible on the created receipt

    const title = 'Grassroots - Ontario vaccination receipt to your Apple wallet';
    const description = 'Stores it on iPhone with a QR code for others to validate in a privacy respecting way.';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://grassroots.vaccine-ontario.ca/',
                    title: title,
                    description: description,
                    // images: [
                    //     {
                    //         url: 'https://covidpass.marvinsextro.de/thumbnail.png',
                    //         width: 1000,
                    //         height: 500,
                    //         alt: description,
                    //     }
                    // ],
                    site_name: title,
                }}
                twitter={{
                    handle: '@grassroots_team',
                    site: '@grassroots_team',
                    cardType: 'summary_large_image',
                }}
            />
            <Page content={
                <div className="space-y-5">
                    {warningMessages.map((message, i) =>
                        <Alert message={message} key={'error-' + i} type="warning" onClose={() => deleteWarningMessage(message)} />
                    )}
                    <Card content={
                        <div><p>{t('common:subtitle')}</p><br /><p>{t('common:subtitle2')}</p><br />
                            <b>{displayPassCount}</b><br/><br/>
                            Oct 3 evening update: 
                            <br />
                            <br />
                            <ul className="list-decimal list-outside" style={{ marginLeft: '20px' }}>
                                <li>Added expiration date to Apple Wallet pass so it aligns with the province's schedule.</li>
                                <li>On Oct 22, we will update this tool as well so you can import the official QR code into your mobile wallet too.</li>
                            </ul><br />
                            <p>{t('common:continueSpirit')}</p>
                            <br />
                            <Link href="https://www.youtube.com/watch?v=AIrG5Qbjptg">
                                <a className="underline" target="_blank">
                                    Click here for a video demo
                                </a>
                            </Link>&nbsp;
                            </div>
                    }/>
                    <Form/>
                </div>
            }/>
        </>
    )
}


export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'index', 'errors'])),
        },
    };
}

export default Index;
