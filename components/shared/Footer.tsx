import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="flex justify-center items-center gap-5 py-5 border-t border-border">
        <p className="text-sm text-gray-500">
          © 2024
          <span className="font-semibold text-purple-600">
            &nbsp;Askify.&nbsp;
          </span>
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
