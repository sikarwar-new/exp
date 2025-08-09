import React from "react";
import Logo from "../assets/logo.png"

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={Logo}
                className="h-8 w-8 rounded-lg flex items-center justify-center"
              />
              <span className="text-xl font-bold bg-clip-text">
                CollabeNote
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Connecting students through quality notes and academic
              collaboration.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-orange-500">For Students</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Browse Notes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Popular Subjects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  How to Buy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Study Tips
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-orange-500">For Sellers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Start Selling
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Seller Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Earnings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-orange-500">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 NotesHub. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button variant="ghost" size="sm">
              Privacy
            </button>
            <button variant="ghost" size="sm">
              Terms
            </button>
            <button variant="ghost" size="sm">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;