
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-[#f5f5f5] border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">© MinaZiggy Co LLC 2025</span>
          <div className="flex items-center gap-4">
            <Link 
              to="/privacy-policy"
              className="hover:text-primary hover:underline transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-conditions"
              className="hover:text-primary hover:underline transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
