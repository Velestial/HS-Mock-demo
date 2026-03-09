import React, { useEffect } from 'react';

interface TermsPageProps {
    onBack: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full bg-white pt-24 pb-16 px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-8 font-mono text-sm border-b border-black pb-1 hover:text-neutral-500 transition-colors"
                >
                    &larr; BACK TO HOME
                </button>

                <h1 className="text-3xl md:text-4xl font-black uppercase mb-12 tracking-tighter">General Terms & Conditions</h1>

                <div className="space-y-8 font-mono text-sm leading-relaxed">
                    <section>
                        <p className="mb-4">
                            <strong>Hey Skipper, LLC Web Services including but not limited to https://www.heyskipperfishing.com</strong>
                        </p>
                        <p className="mb-4">
                            Access to and use of ‘heyskipperfishing.com’ (including any on-line courses, training material and tutorials) (‘the Service’) within the US, UK and internationally is provided by Hey Skipper. LLC (‘we’, ‘us’ or ‘our’) on the following Terms and Conditions.
                        </p>
                        <p className="mb-4">
                            By using the Service you agree to be bound by these Terms and Conditions, which shall take effect immediately on your first use of the Service. If you do not agree to be bound by all of the following Terms and Conditions please do not access, use and/or contribute to the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">1. Use of the Service</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>You agree to use the Service only for lawful purposes. You may not use the Service or any part of it for commercial purposes.</li>
                            <li>You must only use the Service in a way that does not infringe the rights of, restrict or inhibit anyone else’s use and enjoyment of heyskipperfishing.com. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content or disrupting the normal flow of dialogue within the Service.</li>
                            <li>We operate a ‘fair use’ policy to protect the quality of service to our users. If we believe you are using excessive bandwidth or your use of the Service is adversely affecting our network (or any part of it) or our other users we reserve the right to manage or regulate your usage of the Service. This may include temporarily suspending your user account.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">2. Amendments</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Hey Skipper, LLC reserves the right to make change to these Terms and Conditions from time to time and so you should check these Terms and Conditions regularly. Your continued use of the Service will be deemed acceptance of the updated or amended Terms and Conditions. If you do not agree to the changes, you should cease using the Service.</li>
                            <li>If there is any conflict between these Terms and Conditions and specific local terms appearing elsewhere on the Service (including community rules) then the latter shall prevail.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">3. Registration</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>In order to participate in and contribute to heyskipperfishing.com courses and communities you may be required to register with heyskipperfishing.com. Any personal information supplied to heyskipperfishing.com as part of this registration process and/or any other interaction with heyskipperfishing.com will be collected, stored and used in accordance with Hey Skipper, LLC’s Privacy Policy.</li>
                            <li>To register on this website, enter the contest, or purchase a product you must be over 18 years of age unless you have the explicit permission of your parent or guardian.</li>
                            <li>You must ensure that the details provided by you on registration or at any time are correct and complete.</li>
                            <li>You must inform us immediately of any changes to the information that you provided when registering by updating your personal details in order that we can communicate with you effectively.</li>
                            <li>You must keep your password and user name confidential and not disclose them or share them with anyone. If you know or suspect that someone else knows your password you should notify us by contacting info@heyskipperfishing.com immediately.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">4. Intellectual property</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>All copyright, trade marks, design rights, patents and other intellectual property rights (registered and unregistered) in and on Service and all content (including all applications and materials) located on or available through the Service shall remain vested in Hey Skipper, LLC.</li>
                            <li>You must not copy, reproduce, republish, disassemble, decompile, reverse engineer, download, post, broadcast, transmit, make available to the public, or otherwise use heyskipperfishing.com content in any way except for your own personal, non-commercial use.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">5. Availability of the Service</h2>
                        <p>Although we aim to offer you the best service possible, we make no promise that the services available at heyskipperfishing.com will meet your requirements. We cannot guarantee that the Service will be fault-free.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">6. Suspension or cancellation</h2>
                        <p>We may suspend or cancel your registration immediately at our reasonable discretion or if you breach any of your obligations under these Terms and Conditions.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">7. Disclaimers and limitation of liability</h2>
                        <p className="uppercase mb-2 text-xs text-neutral-500">
                            ALL CONTENT PROVIDED ON OR THROUGH THE SERVICE IS PROVIDED “AS IS” AND ON AN “AS AVAILABLE” BASIS. TO THE EXTENT PERMITTED BY LAW, HEY SKIPPER, LLC EXCLUDES ALL REPRESENTATIONS AND WARRANTIES.
                        </p>
                        <p className="uppercase text-xs text-neutral-500">
                            HEY SKIPPER, LLC SHALL NOT BE LIABLE FOR LOSS OF DATA, REVENUE, BUSINESS, OPPORTUNITY, OR GOODWILL.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">15. Shipping & Delivery Policy</h2>
                        <p>
                            Delivered Orders: Once a package is marked as delivered by the carrier to the address provided at checkout, we are not responsible for lost or stolen packages. Customers must contact the carrier directly to resolve delivery issues.
                        </p>
                        <p className="mt-4">
                            450 State Road 13 North Suite 106, PMB 208 Saint Johns, FL 32259<br />
                            info@heyskipperfishing.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
