import type { Route } from "./+types/termsOfService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bike Store - Terms of Service" },
    { name: "description", content: "Know more about our terms of service" },
  ];
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-lg mb-6">
        Welcome to Bike Store. By using our website and services, you agree to
        comply with the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using the Bike Store website, you agree to be bound by
        these terms of service. If you do not agree, please do not use our
        website.
      </p>

      <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
      <p className="mb-4">
        As a user, you agree to provide accurate information, use our services
        in a legal manner, and follow all applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Account Security</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account
        information. Notify us immediately if you believe there is unauthorized
        access to your account.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for any indirect, incidental, or consequential damages
        resulting from the use of our services.
      </p>

      <p className="mt-6">Last updated: January 2025</p>
    </div>
  );
}
