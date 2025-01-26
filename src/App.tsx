import React, { useState } from "react";
import "./App.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "./logo.png";
import ChatPage from "./ChatPage";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);


  const handleStart = () => {
    setIsStarted(true);
  };

  const handleLanguageSelect = (value: string) => {
    setSelectedLanguage(value);
    // Additional logic after selecting language can be added here
  };

  return (
    <>
      {!isStarted ? (
        <>
            <div className="p-4 flex items-center justify-center flex-col">
            <h1 className="text-5xl mb-2">Welcome to Langito</h1>
            <img src={logo} alt="logo" className="w-40 h-40 rounded-full" />
            </div>

          <div className="p-4">
            <p className="text-gray-700" >
              Langito is a personal language assistant that helps you learn a
              new language. You can chat with Langito and ask it to translate
              words, phrases, and sentences for you.
            </p>
          </div>
          <button
            className=" text-white py-2 px-5 rounded"
            onClick={handleStart}
          >
            Let's Start
          </button>
        </>
      ) : (
        <div style={selectedLanguage ? { padding: 16,position:'fixed',top:0,right:0 } : { padding: 0 }}>
          <DropdownMenu>
            <DropdownMenuTrigger className="top-0 bg-transparent border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
            >
              
                {selectedLanguage
                  ? selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
                  : "Select Language you want to translate"}
              
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              side={selectedLanguage ? "top" : "bottom"} // Change position based on selection
            >
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedLanguage ?? ""}
                onValueChange={(value) => handleLanguageSelect(value)}
              >
                <DropdownMenuRadioItem
                  value="english"
                 
                >
                  English
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="french"
                
                >
                  French
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="german"
                >
                  German
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Chat Input */}
      {isStarted && selectedLanguage && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}
        >
          <ChatPage selectedLanguage={selectedLanguage} />
         
        </div>
      )}

      {/* // Add a footer here copyright small  */}
      <footer className="p-4 text-gray-900 text-sm bottom-0 position-fixed">
        <p>&copy; 2025 Langito by Mustafa. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;