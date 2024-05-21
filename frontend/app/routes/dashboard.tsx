import React from "react";
//tailwind
export default function Index() {
  return (
    <div id="main-text">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Dashboard</h1>
      <p className="text-lg text-white-700 mb-4">
        Welcome to your dashboard. Here you can find an overview of your activities and manage your settings.
      </p>
      <p className="text-lg text-white-700">
        Feel free to explore the features and customize your preferences. If you need any help, don't hesitate to reach out to our support team.
      </p>
    </div>
  );
}
