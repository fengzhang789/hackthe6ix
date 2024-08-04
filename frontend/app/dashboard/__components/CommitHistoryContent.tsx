import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import CommitHistoryFileChange from "./CommitHistoryFileChange";
import axios from "axios";
import {
  CommitHistoryContentProps,
  ShaCommit,
  File
} from "@/app/__typings/localtypes";

const CommitHistoryContent = ({
  SHA,
  owner,
  repo,
}: CommitHistoryContentProps) => {
  const [commit, setCommit] = useState<ShaCommit | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [cookies] = useCookies(["accessJwt"]);

  const getCommitInfo = () => {
    if (owner && repo && SHA) {
      axios
        .post(`http://localhost:5000/github/repository/commit/${SHA}`, {
          accessJwt: cookies.accessJwt,
          owner: owner,
          repo: repo,
        })
        .then((response) => {
          setCommit(response.data);
          console.log("response data: ", response);
        })
        .catch((error) => {
          console.error("Error fetching commit:", error);
        });
    }
  };

  const getFileContent = () => {
    if (commit && currentFile) {
      console.log("currentFile.raw_url", currentFile.raw_url)
      axios.get(currentFile.raw_url)
        .then((response) => {
          setFileContent(response.data);
        })
        .catch((error) => {
          console.error("Error fetching file content:", error);
        });
    }
  }

  useEffect(() => {
    console.log("update SHA");
    getCommitInfo();
  }, [SHA]);

  useEffect(() => {
    console.log("update currentFile");
    getFileContent();
  }, [currentFile]);

  return (
    <>
      {commit ? (
        <>
          <div className="flex justify-between items-center mb-4 max-w-[70svw]">
            <h1 className="text-4xl font-bold">Commit Summary</h1>
            <p className="text-gray-600">Branch: Main</p>
          </div>
          <div className="text-lg mb-[3rem]">
            <p>
              Summary~~~~~
              asjdfl;sajdfksajdf;asjdfl;kjasld;fja;lskdjf;laskdjfl;kasjdf;alsjkdf;askdjf;lasjdf;sdf
            </p>
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold"> Files Changed </h1>
          </div>
          <div className="">
            <div className="flex space-x-4 mb-[3rem] overflow-x-auto scrollbar-thin">
              {commit.files.map((file) => (
                <button key={file.sha} onClick={() => {
                  console.log("commit history file changed")
                  setCurrentFile(file)
                }} className="">
                  <CommitHistoryFileChange
                    key={file.sha}
                    title={file.filename}
                    subtitle={`+${file.additions} -${file.deletions}`}
                    body={file.raw_url}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-10 mt-10 flex justify-center items-center">
            {fileContent ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <pre className="whitespace-pre-wrap">{fileContent}</pre>
              </div>
            ) : (
              <p>No file selected</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-center">Choose a commit</p>
        </div>
      )}
    </>
  );
};

export default CommitHistoryContent;