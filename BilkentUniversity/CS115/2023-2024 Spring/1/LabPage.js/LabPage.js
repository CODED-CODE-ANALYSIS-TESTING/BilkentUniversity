import "./assets/bootstrap/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

export const LabPage = () => {
  const [buttonHovered, setButtonHovered] = useState(false);
  const [cabuttonHovered, setCAButtonHovered] = useState(false);
  const [rsbuttonHovered, setRSButtonHovered] = useState(false);
  const [vcfbuttonHovered, setVCFButtonHovered] = useState(false);

  const { labId } = useParams();
  const [lab, setLab] = useState([]);
  const [uploadedLab, setUploadedLab] = useState([]);
  const [uploadedLabId, setUploadedLabId] = useState(null);
  const [gradedByName, setGradedByName] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileId, setFileId] = useState(null);
  const [changeProfileButtonHovered, setChangeProfileButtonHovered] =
    useState(false);
  const [logoutButtonHovered, setLogoutButtonHovered] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [downloadButtonHovered, setDownloadButtonHovered] = useState(false);
  const handleFileDownload = () => {};
  const [selectedFile, setSelectedFile] = useState(null);
  const [remainingTimeStr, setRemainingTimeStr] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadKey, setUploadKey] = useState("");
  const [uploadTime, setUploadTime] = useState(null);
  const [buttonText, setButtonText] = useState("");
  const [showButton, setShowButton] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentDate = new Date();
    const deadlineDate = new Date(lab.deadline);
    setShowButton(true);
    if (lab.lateSubmission) {
      console.log("late submission is allowed");
      console.log("uploaded lab id is", uploadedLab.id != null);

      if (uploadedLab.id != null) {
        setButtonText("Remove Submission");
      } else {
        setButtonText("Add Submission");
      }
      console.log("button text is ", buttonText);
    } else {
      if (currentDate <= deadlineDate) {
        if (uploadedLab.id != null) {
          console.log("uploaded lab id is", uploadedLab.id != null);
          setButtonText("Remove Submission");
        } else {
          setButtonText("Add Submission");
        }
      } else {
        setShowButton(false);
      }
    }
  }, [lab, uploadedLab]);

  // Depend on lab and uploadedLab to recalculate when they change

  function formatDate(dateString) {
    if (!dateString) return " - "; // Check if the date string is null or undefined and return a placeholder

    const date = parseISO(dateString); // Parses the date string into a Date object
    return format(date, "EEEE, d MMMM yyyy, hh:mm aa"); // Formats the date
  }
  const handleDelete = () => {
    //DOWNLOAD ISSUE HERE
    const jwtToken = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    // Use a fallback or add a guard clause
    const uploadKey = uploadedLab?.uploadKey;
    if (!uploadKey) {
      console.error("No upload key available.");
      return;
    }

    console.log("Upload key:", uploadKey);

    if (!uploadKey || !jwtToken || !uploadedLabId) {
      console.error("Upload key, JWT token, or uploaded lab ID is missing.");
      return;
    }

    // First, build the URL for deleting the file from S3
    const s3Url = `http://localhost:8080/api/delete?key=${encodeURIComponent(
      uploadKey
    )}`;

    axios
      .delete(s3Url, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        console.log("File deleted successfully from S3:", response.data);
        // If successful, proceed to delete the corresponding UploadedLab record
        return axios.delete(
          `http://localhost:8080/uploadedLab/${uploadedLabId}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
      })
      .then((dbResponse) => {
        console.log(
          "UploadedLab record deleted successfully:",
          dbResponse.data
        );
        // Additional cleanup or state updates here
      })
      .catch((error) => {
        console.error("Error deleting file or UploadedLab record:", error);
      });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 1) {
      alert("You can only upload one file at a time.");
      event.target.value = ""; // Reset the file input
    } else {
      const file = event.target.files[0];
      setSelectedFile(file); // Set the selected file
      if (file) {
        setSelectedFileName(file.name); // Set the file name
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("userData", "123");
    localStorage.setItem("semester", "2023-2024 Spring");
    localStorage.setItem("uniName", "BilkentUniversity");


    const fetchLab = async () => {
      const userId = localStorage.getItem("userId");
      const jwtToken = localStorage.getItem("jwtToken"); // Retrieve the stored JWT token

      if (!userId) {
        console.error("Student ID is not available.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/lab_assignment/${labId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        console.log("Fetched Lab for Student:", response.data);
        localStorage.setItem("labNo", response.data.labNo);
        console.log("The lab no", response.data.labNo);
        setLab(response.data);
        setFileId(response.data.file_id); // Use setState function to update fileId
        console.log("file id is: ", response.data.file_id);
      } catch (error) {
        console.error("Failed to fetch labs:", error);
      }
    };

    fetchLab();
  }, []);

  useEffect(() => {
    const fetchUploadedLab = async () => {
      const userId = localStorage.getItem("userId");
      const jwtToken = localStorage.getItem("jwtToken"); // Retrieve the stored JWT token

      if (!userId) {
        console.error("Student ID is not available.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/uploadedLab/studentLabAssignment/${labId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        console.log("Fetched UploadedLab for Student:", response.data);
        console.log("labAssignmentId:");

        console.log(response.data.labAssignmentId);
        localStorage.setItem("labId", response.data.labAssignmentId);
        setUploadedLab(response.data);
        setUploadedLabId(response.data.id);
        console.log("UPLOADED LAB ID IS :", response.data.id);
        console.log("graded by ID IS :", response.data.graded_by_id);
        const uploadedLabforInstructor = response.data;
        const userResponse = await axios.get(
          `http://localhost:8080/user/${uploadedLabforInstructor.graded_by_id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        console.log("User response for the graded_by_id:", userResponse.data);
        //uploadedLab.graded_by = userResponse.data;
        setGradedByName(
          userResponse.data.name + " " + userResponse.data.surname
        );
        localStorage.setItem("whoCommented", userResponse.data.id);
        console.log("the whocommented");
        console.log(localStorage.getItem("whoCommented"));
        localStorage.setItem("fullName", userResponse.data.name + userResponse.data.surname);
        console.log( userResponse.data.name + " " + userResponse.data.surname);

        // Update state or perform other operations with uploadedLab

        console.log("UPLOADED LAB graded by is :", uploadedLab.id);
      } catch (error) {
        console.error("Failed to fetch uploaded labs:", error);
      }
    };

    fetchUploadedLab();
  }, []);

  //   useEffect(() => {
  //     const fetchUploadedLab = async () => {
  //         const userId = localStorage.getItem('userId');
  //         const jwtToken = localStorage.getItem('jwtToken');

  //         if (!userId) {
  //             console.error('Student ID is not available.');
  //             return;
  //         }

  //         try {
  //             const response = await axios.get(`http://localhost:8080/uploadedLab/studentLabAssignment/${labId}`, {
  //                 headers: {
  //                     'Authorization': `Bearer ${jwtToken}`
  //                 }
  //             });
  //             console.log("Fetched UploadedLab for Student:", response.data);

  //             // Fetch user information for each graded_by_id
  //             const uploadedLabsWithUserInfo = await Promise.all(response.data.map(async (uploadedLab) => {
  //                 const userResponse = await axios.get(`http://localhost:8080/user/${uploadedLab.graded_by_id}`, {
  //                     headers: {
  //                         'Authorization': `Bearer ${jwtToken}`
  //                     }
  //                 });
  //                 uploadedLab.graded_by = userResponse.data;
  //                 return uploadedLab;
  //             }));

  //             setUploadedLab(uploadedLabsWithUserInfo);
  //             setUploadedLabId(response.data.id);
  //             console.log("UPLOADED LAB ID IS :", response.data.id);
  //         } catch (error) {
  //             console.error('Failed to fetch uploaded labs:', error);
  //         }
  //     };

  //     fetchUploadedLab();
  // }, []);

  // useEffect(() => {
  //   if (!uploadedLab || !lab || uploadedLab.submissionStatus === undefined) {
  //     console.log("Waiting for data...");
  //     return; // Early return if the data is not ready
  //   }

  //   console.log("All data loaded, processing...");
  //   // Adjusted to handle boolean values
  //   if (!uploadedLab.submissionStatus) {
  //     setRemainingTimeStr("-");
  //     console.log("File isn't submitted");
  //   } else {
  //     console.log("File is submitted")
  //     // Calculate the remaining time
  //     const submissionDateObj = new Date(uploadedLab.submissionDate);
  //     const deadlineObj = new Date(lab.deadline);

  //     const timeRemainingMs = deadlineObj - submissionDateObj;

  //     const seconds = Math.floor((timeRemainingMs / 1000) % 60);
  //     const minutes = Math.floor((timeRemainingMs / 1000 / 60) % 60);
  //     const hours = Math.floor((timeRemainingMs / (1000 * 60 * 60)) % 24);
  //     const days = Math.floor(timeRemainingMs / (1000 * 60 * 60 * 24));

  //     let newRemainingTimeStr = '';

  //     if (days > 0) {
  //       newRemainingTimeStr = `Assignment was submitted ${days} days early.`;
  //     } else {
  //       newRemainingTimeStr = `Assignment was submitted ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds early.`;
  //     }

  //     setRemainingTimeStr(newRemainingTimeStr);
  //   }
  // }, [uploadedLab, lab]); // Dependency array to ensure effect runs on updates to these states

  function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    let timeStr = "";

    // Formatting days and hours
    if (days > 0) {
      timeStr += `${days} day${days === 1 ? "" : "s"}, ${hours} hour${
        hours === 1 ? "" : "s"
      }`;
    } else if (hours > 0) {
      timeStr += `${hours} hour${hours === 1 ? "" : "s"}, ${minutes} minute${
        minutes === 1 ? "" : "s"
      }`;
    } else if (minutes > 0) {
      timeStr += `${minutes} minute${
        minutes === 1 ? "" : "s"
      }, ${seconds} second${seconds === 1 ? "" : "s"}`;
    } else {
      timeStr += `${seconds} second${seconds === 1 ? "" : "s"}`;
    }

    return timeStr;
  }

  const handleDownloadLabFile = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const uploadKeyForFile = lab.uploadKey; // Make sure this is correctly pulling from your state
    console.log("Upload key is", uploadKeyForFile);

    if (!uploadKeyForFile || !jwtToken) {
      console.error("Upload key or JWT token is missing.");
      return;
    }

    // Build the query parameter URL
    const url = `http://localhost:8080/api/downloadtolocal?key=${encodeURIComponent(
      uploadKeyForFile
    )}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        responseType: "blob", // Assuming you want to handle a file download
      })
      .then((response) => {
        console.log("File retrieved successfully:", response.data);
        // Create a download link and click it to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", lab.fileName); //to be changed
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error retrieving file:", error);
      });
  };
  const handleDownloadFile = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const uploadKeyForFile = uploadedLab.uploadKey; // Make sure this is correctly pulling from your state
    console.log("Upload key is", uploadKeyForFile);

    if (!uploadKeyForFile || !jwtToken) {
      console.error("Upload key or JWT token is missing.");
      return;
    }

    // Build the query parameter URL
    const url = `http://localhost:8080/api/downloadtolocal?key=${encodeURIComponent(
      uploadKeyForFile
    )}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        responseType: "blob", // Assuming you want to handle a file download
      })
      .then((response) => {
        console.log("File retrieved successfully:", response.data);
        // Create a download link and click it to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", uploadedLab.sourceCodeName); // Provide the filename you want to download as
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error retrieving file:", error);
      });
  };

  // Using formatTime in your useEffect logic
  useEffect(() => {
    if (!lab) {
      console.log("Waiting for lab data...");
      return;
    }

    console.log("All data loaded, processing...");
    const now = new Date();
    const deadlineObj = new Date(lab.deadline);

    // Handling cases where there is no lab submission
    if (!uploadedLab || uploadedLab.submissionStatus !== true) {
      console.log("No submission or file isn't submitted");
      const timeRemainingMs = deadlineObj - now;

      if (timeRemainingMs > 0) {
        // Time until deadline
        const timeMessage = formatTime(timeRemainingMs);
        setRemainingTimeStr(`Time until deadline: ${timeMessage}`);
      } else {
        // Overdue time
        const overdueTimeMessage = formatTime(-timeRemainingMs);
        setRemainingTimeStr(`Assignment is overdue by: ${overdueTimeMessage}`);
      }
    } else {
      // File is submitted
      console.log("File is submitted");
      const submissionDateObj = new Date(uploadedLab.submissionDate);
      const timeEarlyMs = submissionDateObj - deadlineObj;

      if (timeEarlyMs < 0) {
        // Submitted early
        const earlyTimeMessage = formatTime(-timeEarlyMs);
        setRemainingTimeStr(
          `Assignment was submitted ${earlyTimeMessage} early.`
        );
      } else {
        // Submitted late
        const lateTimeMessage = formatTime(timeEarlyMs);
        setRemainingTimeStr(
          `Assignment was submitted ${lateTimeMessage} late.`
        );
      }
    }
  }, [uploadedLab, lab]);

  const handleUpload = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (!selectedFile || !jwtToken) {
      console.error("Selected file or JWT token is missing.");
      return;
    }

    const key = `user-uploads/${userId}/${new Date().getTime()}-${
      selectedFile.name
    }`;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("bucketName", "coded-bucket");
    formData.append("key", key);

    // Define headers for the request
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post("http://localhost:8080/api/upload", formData, { headers: headers })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        setUploadKey(key);
        localStorage.setItem("uploadKey", key);
        setUploadTime(new Date());
        console.log("lab assignment id of the uploaded lab is: ", labId);

        const uploadedLabData = {
          isPlagiarised: false,
          similarityRate: 0.0,
          feedback: "",
          submissionStatus: true,
          grade: -1,
          isGraded: false,
          sourceCodeName: selectedFile.name,
          submissionDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          gradedOn: null,
          graded_by: null,
          labAssignmentId: labId,
          labPartId: null,
          studentId: userId,
          isActive: true,
          creationDate: new Date().toISOString(),
          uploadKey: key,
        };

        return axios.post(
          "http://localhost:8080/uploadedLab",
          uploadedLabData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      })
      .then((response) => {
        console.log("UploadedLab created successfully:", response.data);
        // Now call the processZip endpoint
        return axios.get(
          `http://localhost:8080/api/processZip?key=${encodeURIComponent(key)}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      })
      .then((zipResponse) => {
        console.log("Zip file processed successfully:", zipResponse.data);
      })
      .catch((error) => {
        console.error("Error during the upload or zip processing:", error);
      });
  };

  useEffect(() => {
    applyTextGradient(
      ["labText", "submissionText"],
      [
        [
          [43, 10, 255],
          [195, 7, 249],
          [234, 56, 193],
          [255, 140, 175],
          [251, 143, 139],
        ],
        [
          [43, 10, 255],
          [195, 7, 249],
          [234, 56, 193],
          [255, 140, 175],
          [251, 143, 139],
        ],
      ]
    );
  }, []);

  function applyTextGradient(elementIds, colors) {
    elementIds.forEach((elementId, index) => {
      var element = document.getElementById(elementId);
      if (element) {
        element.style.background = `linear-gradient(to right, rgb(${colors[index][0]}), rgb(${colors[index][1]}), rgb(${colors[index][2]}), rgb(${colors[index][3]}), rgb(${colors[index][4]}))`;
        element.style.webkitBackgroundClip = "text";
        element.style.color = "transparent";
        element.style.display = "inline-block";
      }
    });
  }

  const goToChatbot = () => {
    window.open(`/labs/${labId}/chats/`, "_blank");
  };

  const goToCodeAnalysis = () => {
    navigate("/CodeAnalysisUpload");
  };

  const downloadFile = (fileName) => {
    window.location.href = `http://localhost:3000/api/files/download?fileName=${fileName}`;
  };

  return (
    <>
      <>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        <title>Home - Brand</title>
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="assets/css/Drag-Drop-File-Input-Upload.css"
        />
        <NavBar></NavBar>

        <section className="py-5 mt-5">
          <div className="container py-5">
            <div>
              <h1 className="display-4 fw-bold mb-5">
                <span id="labText">Lab {lab.labNo}:&nbsp;</span>
                {lab.objective}
              </h1>
              <h4
                onClick={handleDownloadLabFile}
                className=" display-10  mb-5"
                id="labText"
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {lab.fileName}
              </h4>

              <button
                className="btn btn-primary shadow"
                role="button"
                onClick={goToChatbot}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                style={{
                  background: buttonHovered
                    ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                    : "#ffffff",
                  color: buttonHovered ? "#ffffff" : "#a50bf6",
                  boxShadow:
                    "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                  borderRadius: 13,
                  borderWidth: 3,
                  marginBottom: 40,
                  marginTop: 15,
                  borderColor: buttonHovered
                    ? "var(--bs-navbar-active-color)"
                    : "#a50bf6",
                  marginRight: 20, // Right margin to add space between the buttons
                }}
              >
                Chatbot
              </button>
              <button
                className="btn btn-primary shadow"
                role="button"
                onClick={goToCodeAnalysis}
                onMouseEnter={() => setCAButtonHovered(true)}
                onMouseLeave={() => setCAButtonHovered(false)}
                style={{
                  background: cabuttonHovered
                    ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                    : "#ffffff",
                  color: cabuttonHovered ? "#ffffff" : "#a50bf6",
                  boxShadow:
                    "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                  borderRadius: 13,
                  borderWidth: 3,
                  marginBottom: 40,
                  marginTop: 15,
                  borderColor: cabuttonHovered
                    ? "var(--bs-navbar-active-color)"
                    : "#a50bf6",
                }}
              >
                Code Analysis Upload
              </button>
            </div>

            {/* <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="display-6 fw-bold mb-4" />
              Lab2_Strings_Section3_10Oct.pdf&nbsp; &nbsp; &nbsp;{" "}
              <button
                className="btn btn-primary shadow"
                role="button"
                onMouseEnter={() => setDownloadButtonHovered(true)}
                onMouseLeave={() => setDownloadButtonHovered(false)}
                style={{
                  background: downloadButtonHovered
                    ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                    : "#ffffff",
                  color: downloadButtonHovered ? "#ffffff" : "#a50bf6",
                  boxShadow:
                    "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                  borderRadius: 13,
                  borderWidth: 3,
                  borderColor: downloadButtonHovered ? "#ffffff" : "#a50bf6",
                }}
                onClick={handleFileDownload}
              >
                Download
              </button>
              <div />
            </div> */}
            <div id="page-top">
              <div id="wrapper">
                <div className="d-flex flex-column" id="content-wrapper">
                  <div id="content">
                    <div>
                      <div className="container">
                        <table className="table table-hover table-custom">
                          <thead className="thead-light">
                            <tr>
                              <th>Item</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Uploaded</td>
                              <td>{formatDate(lab.publishTime)}</td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>Due</td>
                              <td>{formatDate(lab.deadline)}</td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>Late Submission</td>
                              <td>Not applicable</td>
                              <td>
                                {lab.lateSubmission ? "Allowed" : "Not Allowed"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="feedback-container">
                        <div className="feedback-card">
                          <h1 className=" display-10 fw-bold mb-5" id="labText">
                            Submission Details
                          </h1>

                          <div className="feedback-card-body">
                            <p>
                              <strong>Submission Status:</strong>
                              {uploadedLab.submissionStatus
                                ? "Submitted for Grading"
                                : "No Attempt"}
                            </p>
                            <p>
                              <strong>Grading Status:</strong>{" "}
                              {uploadedLab.graded ? "Graded" : "Not Graded"}
                            </p>
                            <p>
                              <strong>Time Remaining:</strong>{" "}
                              {remainingTimeStr}
                            </p>
                            <p>
                              <strong>Last Modified:</strong>
                              {formatDate(uploadedLab.lastModified)}
                            </p>
                            {/* <p>
                              <strong>Submission Comments:</strong> Great work!
                            </p> */}
                            {/* <p>
                              <strong>File Submissions:</strong>{" "}
                              {uploadedLab.sourceCodeName}
                            </p> */}
                          </div>
                        </div>
                      </div>

                      <header>
                        <div className="container pt-4 pt-xl-5">
                          <div className="row pt-5">
                            <div className="col-md-8 col-lg-9 text-center text-md-start mx-auto">
                              <div className="text-center">
                                {/* <h1 className="display-4 fw-bold mb-5" style={{ fontSize: 30 }} id='submissionText'>
                                        Submission
                                    </h1> */}
                              </div>
                              <div
                                className="table-responsive text-center d-lg-flex"
                                style={{
                                  boxShadow: "0px 0px 14px 2px #bec1de",
                                  borderRadius: "13px",
                                }}
                              >
                                <table className="table table-striped-columns table-hover">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        Submitted Files
                                      </th>
                                      <th className="text-center">
                                        Submission Time
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td
                                        onClick={handleDownloadFile}
                                        style={{
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {uploadedLab.sourceCodeName ||
                                          "No file uploaded yet"}
                                      </td>
                                      <td>
                                        {formatDate(uploadedLab.submissionDate)}
                                      </td>
                                      {/* <td>%2</td> */}

                                      {/* <td>
                                                {<button type="button" onClick={() => handleDelete(uploadKey)}>Delete</button>}

                                                </td> */}
                                    </tr>

                                    <tr />
                                  </tbody>
                                </table>
                              </div>
                              <div className="text-center position-relative" />
                            </div>
                          </div>
                        </div>
                      </header>
                      <div className="container d-flex justify-content-center align-items-center">
                        {/* Centered container for file upload */}
                        <div className="row pt-5">
                          <div className="col-md-8 text-center text-md-start mx-auto">
                            <div className="text-center">
                              {/* <div className="files color form-group mb-3">
                                <input type="file"  name="files" onChange={handleFileChange} />
                            </div> */}
                              {/* <button
                                    className="btn btn-primary shadow"
                                    role="button"
                                    onClick={handleUpload}
                                    onMouseEnter={() => setButtonHovered(true)}
                                    onMouseLeave={() => setButtonHovered(false)}
                                    style={{
                                        background: buttonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                        color: buttonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        marginBottom: 40,
                                        marginTop: 15,
                                        borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6",

                                    }}
                                >
                                    {buttonText}
                                </button> */}
                              {showButton && (
                                <>
                                  <div className="files color form-group mb-3">
                                    <input
                                      type="file"
                                      name="files"
                                      onChange={handleFileChange}
                                    />
                                  </div>
                                  <button
                                    className="btn btn-primary shadow"
                                    onMouseEnter={() => setRSButtonHovered(true)}
                                    onMouseLeave={() => setRSButtonHovered(false)}
                                    style={{
                                      background: rsbuttonHovered
                                        ? `linear-gradient(to right, #C307F9, #EA38C1, #FB8F8B)`
                                        : "#ffffff",
                                      color: rsbuttonHovered
                                        ? "#ffffff"
                                        : "#a50bf6",
                                      boxShadow:
                                        "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                      borderRadius: 13,
                                      borderWidth: 3,
                                      marginBottom: 40,
                                      marginTop: 15,
                                      borderColor: rsbuttonHovered
                                        ? "var(--bs-navbar-active-color)"
                                        : "#a50bf6",
                                    }}
                                    onClick={
                                      buttonText === "Add Submission"
                                        ? handleUpload
                                        : handleDelete
                                    }
                                  >
                                    {buttonText}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {uploadedLab.graded ? (
                  <div>
                    <div className="feedback-container">
                      <div className="feedback-card">
                        <h1 className="text-center">Feedback</h1>
                        <div className="feedback-card-body">
                          <p>
                            <strong>Grade:</strong> {uploadedLab.grade}
                          </p>
                          {/* <p>
                            <strong>Number of test cases passed:</strong>
                            {uploadedLab.passedTcaseNum}
                          </p>
                          <p>
                            <strong>Number of test cases failed:</strong> {uploadedLab.failedTcaseNum}
                          </p> */}
                          <p>
                            <strong>Graded on:</strong>{" "}
                            {formatDate(uploadedLab.gradedOn)}
                          </p>
                          <p>
                            <strong>Graded by:</strong> {gradedByName}
                          </p>
                          <p>
                            <strong>Feedback Comment:</strong>{" "}
                            {uploadedLab.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-primary shadow"
                      onMouseEnter={() => setVCFButtonHovered(true)}
                      onMouseLeave={() => setVCFButtonHovered(false)}
                      style={{
                        background: vcfbuttonHovered
                          ? `linear-gradient(to right, #C307F9, #EA38C1, #FB8F8B)`
                          : "#ffffff",
                        color: vcfbuttonHovered ? "#ffffff" : "#a50bf6",
                        boxShadow:
                          "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                        borderRadius: 13,
                        borderWidth: 3,
                        marginBottom: 40,
                        marginTop: 15,
                        borderColor: vcfbuttonHovered
                          ? "var(--bs-navbar-active-color)"
                          : "#a50bf6",
                      }}
                      onClick={()=>navigate("/StudentCodeFeedback")}
                    >
                      View Code Feedback
                    </button>
                    
                    <div className="row pt-5">
                      <div className="col-md-8 text-center text-md-start mx-auto">
                        {/* <div className="text-center">
            <button
              className="btn btn-primary shadow"
              role="button"
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                background: buttonHovered
                  ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                  : "#ffffff",
                color: buttonHovered ? "#ffffff" : "#a50bf6",
                boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                borderRadius: 13,
                borderWidth: 3,
                marginBottom: 40,
                marginTop: 15,
                borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6",
              }}
            >
              Complain your grade
            </button>
          </div> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center"></div>
                )}
              </div>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </>
  );
};
