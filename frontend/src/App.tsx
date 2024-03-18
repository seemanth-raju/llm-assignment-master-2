import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./App.css";
import { FaUserAlt } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaBots } from "react-icons/fa6";
import EmptyResponse from "./components/EmptyResponse";

interface Data {
  id: string;
  question_text: string;
  file_question: string;
  result: string;
}
export default function App() {
  const [data, setData] = useState<Data[]>([]);
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [isloading,setIsLoading]=useState(true)
  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prevent multiple submissions while request is in progress
    if (submitting) {
      return;
    }

    setSubmitting(true); // Set submitting state to true

    const formData = new FormData();

    // Append question to form data if provided
    if (question) {
      formData.append("question", question);
    }

    // Append file to form data if provided
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const responseData = await response.json();
      setResult(responseData.result);
      setQuestion("");
      setFile(undefined);
      getData();
    } catch (error) {
      console.error("Error:", error);
      setResult(
        "An error occurred while processing your request. Please try again later."
      );
    } finally {
      setSubmitting(false); // Reset submitting state after request completes
    }
  };

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:8000/retrieve-data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [file, question]);
  useEffect(()=>{
    getData()
  },[])
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);
  return (
    <div className="relative border rounded-lg overflow-hidden m-4 shadow-lg overflow-y-auto" style={{ minHeight: "95vh" }}>
      <div className="sticky top-0 z-50 border-b border-gray-300 bg-white py-5 px-8 text-left text-sm text-gray-800">
        <h4 className="text-center mx-auto font-sans font-semibold normal-case text-2xl">Chat Bot</h4>
      </div>
      
          <div className="flex-grow px-8 py-8 text-left text-gray-700" style={{ minHeight: "60vh" }}>
          <div className="relative mb-6 text-center">
            <span className="relative bg-white px-2 text-lg text-gray-600">Response</span>
          </div>
          {
            isloading ? (
              <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
            ) : (
              <div className="overflow-y-auto mt-2" style={{maxHeight:"60vh"}}>
            {/* Mapping through data to render responses */}
            {data ? (
              data.map((item, index) => (
                <div key={index} className="">
                  <div className="mb-6 text-left">
                    <div className="text-gray-700">
                      <div className="absolute inset-x-0 top-0">
                        <div className="float-right inline-block rounded-full">
                          {/* Example icon */}
                          <FaUserAlt className="w-8 h-8 mx-auto" />
                        </div>
                      </div>
                      <div className="relative float-right mr-8 sm:mr-16 inline-block rounded-md bg-blue-700 py-3 px-4 text-white">
                        <div className="max-h-40 max-w-60 md:max-w-screen-md overflow-y-auto">
                          <p className="text-sm">
                            {file && item.file_question ? item.file_question : item.question_text}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="clear-both flex text-gray-700"></div>
                  </div>
  
                  <div className="relative mb-6 text-left">
                    <div className="text-white">
                      <div className="absolute top-0 left-0">
                        <div className="float-right inline-block rounded-full">
                          <FaBots className="w-8 h-8 mx-auto" />
                        </div>
                      </div>
                      <div className="relative float-left ml-8 sm:ml-16 inline-block rounded-md bg-green-600 py-3 px-4">
                        <div className="max-h-40 max-w-60 md:max-w-screen-md overflow-y-auto">
                          <p className="text-sm">{item.result}</p>
                        </div>
                      </div>
                    </div>
                    <div className="clear-both flex text-gray-700"></div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyResponse />
            )}
          </div>
            )
          }
          
          {/* Responses Container with scrolling behavior */}
          
  
          <hr className="bg-gray-200 border-0 flex flex-col justify-center items-center" />
        </div>
        
      

      {/* Form with fixed position */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
        <form onSubmit={handleSubmit} className="flex items-center justify-center">
          <label htmlFor="fileInput" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 cursor-pointer h-10 rounded-l-lg">
            <FaUpload />
            <input id="fileInput" type="file" onChange={handleFileChange} className="hidden h-10" />
          </label>
          <input type="text" placeholder="Enter Question..." value={question} onChange={handleQuestionChange} className="border border-gray-300 px-4 py-2 flex-grow h-10" />
          <button disabled={submitting || (!question && !file)} type="submit" className="disabled:bg-green-300 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
