import React, { useEffect } from 'react';

interface PrivacyPolicyPageProps {
    onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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

                <h1 className="text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter">Our Privacy Policy</h1>

                <div className="space-y-8 font-mono text-sm leading-relaxed">
                    <section>
                        <p className="mb-4">
                            We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
                        </p>
                        <p className="mb-4">
                            We use <a href="https://patchstack.com/privacy-policy/" target="_blank" rel="noreferrer" className="underline">PatchStack</a> Security to protect our Site from Brute Force Attacks, Cross Site Scripting, and any other forms of attacks that try to compromise our site infrastructure.
                        </p>
                        <p className="mb-4">
                            Google’s advertising requirements can be summed up by Google’s Advertising Principles. They are put in place to provide a positive experience for users. <a href="https://support.google.com/adwordspolicy/answer/1316548?hl=en" target="_blank" rel="noreferrer" className="underline">Google Advertising Principles</a>
                        </p>
                        <p>
                            We use WooCommerce as our E-Commerce Platform to sell our Products to you the consumer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4">What we collect and store</h2>
                        <p className="mb-4">While you visit our site, we’ll track:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Products you’ve viewed: we’ll use this to, for example, show you products you’ve recently viewed</li>
                            <li>Location, IP address and browser type: we’ll use this for purposes like estimating taxes and shipping</li>
                            <li>Shipping address: we’ll ask you to enter this so we can, for instance, estimate shipping before you place an order, and send you the order!</li>
                        </ul>
                        <p className="mb-4">We’ll also use cookies to keep track of cart contents while you’re browsing our site.</p>
                        <p className="mb-4">
                            When you purchase from us, we’ll ask you to provide information including your name, billing address, shipping address, email address, phone number, credit card/payment details and optional account information like username and password. We’ll use this information for purposes, such as, to:
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Send you information about your account and order</li>
                            <li>Respond to your requests, including refunds and complaints</li>
                            <li>Process payments and prevent fraud</li>
                            <li>Set up your account for our store</li>
                            <li>Comply with any legal obligations we have, such as calculating taxes</li>
                            <li>Improve our store offerings</li>
                            <li>Send you marketing messages, if you choose to receive them</li>
                        </ul>
                        <p className="mb-4">
                            If you create an account, we will store your name, address, email and phone number, which will be used to populate the checkout for future orders.
                        </p>
                        <p className="mb-4">
                            We generally store information about you for as long as we need the information for the purposes for which we collect and use it, and we are not legally required to continue to keep it.
                        </p>
                        <p>
                            We will also store comments or reviews, if you choose to leave them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4">Who on our team has access</h2>
                        <p className="mb-4">
                            Members of our team have access to the information you provide us. For example, both Administrators and Shop Managers can access:
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Order information like what was purchased, when it was purchased and where it should be sent, and</li>
                            <li>Customer information like your name, email address, and billing and shipping information.</li>
                        </ul>
                        <p>
                            Our team members have access to this information to help fulfill orders, process refunds and support you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4">What we share with others</h2>
                        <p className="mb-4">
                            We share information with third parties who help us provide our orders and store services to you; such as <a href="https://www.shipstation.com/privacy-policy/" target="_blank" rel="noreferrer" className="underline">ShipStation</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
