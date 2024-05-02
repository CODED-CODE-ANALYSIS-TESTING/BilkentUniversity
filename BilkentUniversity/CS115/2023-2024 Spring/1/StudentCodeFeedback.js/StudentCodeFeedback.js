import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "./CodeAnalysis.css";
import { dark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import pythonCode from "./exampleCode.py";
import ReactTooltip from "react-tooltip";
import { SonarQubeIssue } from "./SonarQubeIssue";
import './Bubble.css';
import CodeFeedbackBubble from "./CodeFeedbackBubble";

const StudentCodeFeedback = () => {
  const [enrollButtonHovered, setEnrollButtonHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [initialBorderStyle, setInitialBorderStyle] = useState(
    "1px solid rgba(0, 0, 0, 0.125)"
  );
  const [studentCode, setStudentCode] = useState("");
  const [selectedLine, setSelectedLine] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [issues, setIssues] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [activeIssue, setActiveIssue] = useState(null);
  const [selectedActiveBubble, setSelectedActiveBubble] = useState(null);
  const [isDarkMode, setDarkMode] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0); // Start with the default sidebar width
  const [selectedBubbleId, setSelectedBubbleId] = useState(null);
  const [downloadButtonHovered, setDownloadButtonHovered] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fetchedStudentCode, setFetchedStudentCode] = useState(true);

  const codeLines = studentCode.split("\n");

  
  const toggleSwitch = () => {
    setDarkMode(!isDarkMode);
  };
  const getLineStyle = (isLineHovered, isDarkMode, lineNumber) => {
    // Default styles for dark mode or light mode
    let style = isDarkMode ? {
        background: "#333333",
        color: "#dddddd",
        boxShadow: "none",
        borderRadius: "0px",
        borderWidth: "3px",
        borderColor: "#aaaaaa",
    } : {
        background: "#ffffff",
        color: "#a50bf6",
        boxShadow: "0px 0px 8px 7px rgba(0, 0, 0, 0.2)",
        borderRadius: "0px",
        borderWidth: "3px",
        borderColor: "#a50bf6",
    };

    // Modify styles if the line is hovered
    if (isLineHovered) {
        style = {
            ...style,
            background: isDarkMode ? "linear-gradient(to right, #555, #777, #999)" : "linear-gradient(to right, #FFB6C1, #FFC0CB, #FF69B4)",
            color: isDarkMode ? "#ffffff" : "#000000",
            borderColor: isDarkMode ? "#ffffff" : "#FF69B4",
        };
    }
    
    if (selectedActiveBubble && lineNumber == selectedActiveBubble.startLine) {
      // Apply glowing effect for active issue lines
      style = {
        ...style,
        background: isDarkMode ? "linear-gradient(to right, #555, #777, #999)" : "linear-gradient(to right, #FFB6C1, #FFC0CB, #FF69B4)",
        color: isDarkMode ? "#ffffff" : "#000000",
        borderColor: isDarkMode ? "#ffffff" : "#FF69B4",
    };
    }
    return style;
};

useEffect(() => {
  //getFileFromS3(String key);
  const fetchStudentCode = async () => {
    //buranin mantigini kontrol et yeni folder mantigi farkli cunku
    const jwtToken = localStorage.getItem('jwtToken'); 
    const fileName = localStorage.getItem('userFile');
    console.log("before removing");

    console.log(fileName);
    const newname = localStorage.getItem('userFile').replace(/"/g, ''); // Remove quotes if present
    console.log("after removing");
    console.log(newname);
    const encodedFileName = newname.split('/').map(part => encodeURIComponent(part)).join('/');
    setFileName(getFileNameFromPath(encodedFileName));
    
    try {
      const response = await fetch(`http://localhost:8080/api/getfilefromcloud?key=${encodedFileName}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const code = await response.text();
        setStudentCode(code);
        setFetchedStudentCode(false);
       
    } catch (e) {
        console.log(e);
    }
};
if (fetchStudentCode){
  fetchStudentCode();
}
  
}, []);





useEffect(() => {
  //getFileFromS3(String key);
  const fetchFeedback = async () => {
    const uploadedLabId = localStorage.getItem("labId");
    //const uploadedLabId = 1;

    const commentedOn = localStorage.getItem("userId");
    //const commentedOn = 21903976;

    //const whoCommented = localStorage.getItem("userId");
    //const whoCommented = 2303845768;
    const whoCommented = localStorage.getItem("whoCommented");
    const labId = localStorage.getItem("labId");

    const codeFileKey = localStorage.getItem("key");
    const jwtToken = localStorage.getItem("jwtToken");
    console.log("uploadedlabid");
    console.log(uploadedLabId);
    console.log("labId", labId);

    console.log("commentedOn");
    console.log(commentedOn);

    console.log("whoCommented");
    console.log(whoCommented);

    console.log("codeFileKey");


    console.log("jwtToken");
    console.log(jwtToken);

    const newname = localStorage.getItem("userFile").replace(/"/g, ""); // Remove quotes if present
    console.log("after removing");
    console.log(newname);
    const encodedFileName = newname
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");

    try {
      const response = await fetch(`http://localhost:8080/codefeedback/getcodefeedback?whocommented=${whoCommented}&commentedon=${commentedOn}&codefilekey=${encodedFileName}`,
          {  method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("the result");
        console.log(result);
        console.log(result);


        //console.log(response.data);
        setIssues(result);

       
    } catch (e) {
        console.log(e);
    }
};

fetchFeedback();
}, []);





const handleFileDownload = async () => {
  const jwtToken = localStorage.getItem('jwtToken'); 
  const newname = localStorage.getItem('userFile').replace(/"/g, ''); // Remove quotes if present
  console.log("after removing");
  console.log(newname);
  const encodedFileName = newname.split('/').map(part => encodeURIComponent(part)).join('/');
  try {
    const response = await fetch(`http://localhost:8080/api/downloadtolocal?key=${encodedFileName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
      }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      // Optionally set a filename here
      a.download = newname.split('/').pop(); // This will download the file with the last part of the path as filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
} catch (e) {
    console.log(e);
}
};
function getFileNameFromPath(path) {
  // Check if the path is null or empty
  if (!path) {
      return path; // or throw an Error if needed
  }

  // Find the last index of the slash
  const lastSlashIndex = path.lastIndexOf('/');

  // Check if the slash was found and is not at the end of the string
  if (lastSlashIndex !== -1 && lastSlashIndex !== path.length - 1) {
      return path.substring(lastSlashIndex + 1);
  }

  return path; // Return the original path if no slash was found or it was at the end
}
  const customLineProps = (lineNumber) => {
    //console.log("inside customLineProps");
    let props = {}; // Initialize props object to potentially include style and event handlers
    let selectedissuehighlight = {};
    const style = { backgroundColor: "rgba(255, 0, 0, 0.3)" }; // Default style for issues
    let isLineRelatedToActiveBubble = false;

    if (selectedActiveBubble && lineNumber == selectedActiveBubble.startLine ) {
      // Apply glowing effect for active issue lines
      style.backgroundColor = "rgba(255, 215, 0, 0.5)"; 
      style.cursor = "pointer"; // Add cursor pointer to indicate clickable
    } else {
      // Default style for lines not related to the active bubble but might still have issues
      style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    }
  
    for (const issue of issues) {
      // Check if there's an active issue and the current line is within its range
      if ( activeIssue && (lineNumber == activeIssue.startLine) ) {
        // Apply highlight style for these lines

        style.className = 'line-highlight'; // Apply highlighting class

        style.backgroundColor = "rgba(0, 255, 0, 1)"; // Green background for active issue lines
      }
     
      if (lineNumber == issue.lineOfCode) {
        // Found an issue for this line, apply styles and event handlers
        const explanation = issue.comment; // Assuming the explanation is in `message`
        const isLineHovered = lineNumber === hoveredLine;

        // Enhance style for hovered line
        if (isLineHovered) {
          style.cursor = "pointer";
          style.backgroundColor = "rgba(255, 0, 0, 0.4)"; // Darker on hover
        }

        // Attach event handlers only for lines with issues
        props = {
          style: getLineStyle(isLineHovered, isDarkMode, lineNumber),
          selectedissuehighlight,
          onMouseEnter: () => setHoveredLine(lineNumber),
          onMouseLeave: () => setHoveredLine(null),
          onClick: () => handleLineClick(lineNumber, explanation, issue),
        };
        break; // No need to check further issues
      }
    }
    // For lines without issues, props will be an empty object, thus not attaching any event handlers
    return props;
  };

  
  useEffect(() => {
    applyTextGradient("headerText", ["#2B0AFF", "#C307F9"]);

  }, []);


  function applyTextGradient(elementId, colors) {
    var element = document.getElementById(elementId);
    if (element) {
      element.style.background = `linear-gradient(to right, ${colors.join(
        ", "
      )})`;
      element.style.webkitBackgroundClip = "text";
      element.style.color = "transparent";
      element.style.display = "inline-block";
    }
  }
  const switchStyle = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: isDarkMode ? "flex-start" : "flex-end",
      width: "100px", // Adjust width as necessary
      height: "40px", // Adjust height as necessary
      background: isDarkMode
        ? `linear-gradient(to right, #C307F9, #EA38C1, #FB8F8B)`
        : "#bbbbbb",
      borderRadius: "20px",
      padding: "5px",
      transition: "background-color 0.3s",
      cursor: "pointer",
      position: "relative", // Added for absolute positioning of the label
      fontSize: "12px",
      marginLeft: "220px", // Adjust font size as necessary
    },
    toggle: {
      width: "30px", // Adjust knob size as necessary
      height: "30px", // Adjust knob size as necessary
      background: "#ffffff",
      borderRadius: "50%",
      position: "absolute",
      transition: "left 0.3s",
      left: isDarkMode ? "60px" : "10px", // Adjust left position as necessary
    },
    label: {
      position: "absolute",
      color: "#ffffff",
      fontWeight: "bold",
    },
    labelOn: {
      left: "10px", // Adjust label position as necessary
    },
    labelOff: {
      right: "10px", // Adjust label position as necessary
    },
  };

  const containerStyles = {
    backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // #FFFFFF is just an example for light mode
    color: isDarkMode ? "#FFFFFF" : "#000000", // You might want to change the text color as well
    transition: "background-color 0.3s ease", // Smooth transition for color change
  };
  const handleLineClick = (lineNumber, explanation, issue) => {
    console.log("clicked");
    setSelectedLine(lineNumber);
    setExplanation(explanation);
    const relevantIssue = issues.find(
      (issue) => lineNumber == issue.startLine
    );
    setActiveIssue(relevantIssue);

    const existingBubbleIndex = bubbles.findIndex(
      (bubble) =>
        lineNumber == bubble.line
    );
    
    console.log("The bubble exists");
    console.log(existingBubbleIndex);

    // Assuming existingBubbleIndex identifies the bubble to be moved to the middle
    if (existingBubbleIndex !== -1) {
      // Step 1: Remove the existing bubble and store it
      const existingBubble = bubbles[existingBubbleIndex];
      const bubblesWithoutExisting = bubbles.filter(
        (_, index) => index !== existingBubbleIndex
      );

      // Step 2: Calculate the new middle index
      const middleIndex = Math.floor(bubblesWithoutExisting.length / 2);

      // Step 3: Insert the existing bubble into the middle of the new array
      bubblesWithoutExisting.splice(middleIndex, 0, existingBubble);

      // Update the bubbles state with this new array
      setBubbles(bubblesWithoutExisting);

      console.log("The updated bubble value:");
      console.log(bubblesWithoutExisting);
    } else {
      // No existing bubble for this line, create a new one
      console.log("Creating new bubble...");
      
      setBubbles((prevBubbles) => [
        ...prevBubbles,
        {
          id: bubbles.length + 1, // Simple ID generation, consider using something like UUID in a real app
          content: explanation,
          fullName: localStorage.getItem("fullName"),
          lineOfCode: lineNumber
          
      }
      ]);
      console.log("The new bubble's linenumber");
      console.log(lineNumber);
    }
  };
  const mainContentWidth = `calc(100% - ${sidebarWidth}px)`;
  const handleBubbleClick = (id) => {
    const clickedBubble = bubbles.find(bubble => bubble.id === id);
    if(clickedBubble) {
      setSelectedActiveBubble({
            startLine: clickedBubble.startLine,
        });
        setSelectedBubbleId(id); // Keep track of the selected bubble
        console.log("startline ");
        console.log(clickedBubble.startLine);
    } else {
        // If for some reason the bubble isn't found, clear the active issue
        setSelectedActiveBubble(null);
    }
};



  const handleCloseBubble = (id) => {
    // Close bubble logic here
    setBubbles(bubbles.filter(bubble => bubble.id !== id));
    if (selectedBubbleId === id) {
        setSelectedBubbleId(null); // Deselect bubble if it's being closed
    }
};

  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
      />
      <title>Code Analysis Results</title>
      <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
      />
      <link
        rel="stylesheet"
        href="assets/css/Drag-Drop-File-Input-Upload.css"
      />
      <div style={containerStyles}>
        {" "}
        <NavBar isDarkMode={isDarkMode} activeSection="dashboard" />
        <section className="py-5 mt-5">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <h2 className="display-6 fw-bold mb-4">
                  Code Feedback
                </h2>
              </div>
            </div>
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="display-6 fw-bold mb-4" />
              <div className="d-flex align-items-center justify-content-start">
                <h2 className="display-10 fw-bold mb-1">Dark Mode</h2>
                <div style={switchStyle.container} onClick={toggleSwitch}>
                  <div
                    style={{
                      ...switchStyle.label,
                      ...(isDarkMode
                        ? switchStyle.labelOn
                        : switchStyle.labelOff),
                    }}
                  >
                    {isDarkMode ? "Dark" : "Light"}
                  </div>
                  <div style={switchStyle.toggle} />
                </div>
              </div>

              <p>
                <br />
                {fileName} &nbsp; &nbsp; &nbsp;{" "}
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
              </p>

              <div />
            </div>

            <div className={isDarkMode ? "dark-mode" : "light-mode"}>
              
            <div className="code-explanation-container" style={{ width: mainContentWidth }}>
              <div>
             
                <SyntaxHighlighter
                  language="python"
                  style={isDarkMode ? dark : prism} // Set the style based on isDarkMode
                  wrapLines={true}
                  showLineNumbers={true}
                  lineProps={(lineNumber) => customLineProps(lineNumber)}
                >
                  {studentCode}
                </SyntaxHighlighter>
                </div>
              </div>
              <div className="bubbles-container" style={{ position: 'absolute', right: '20px', top: '100px' }}>
                {bubbles.map((bubble, index) => (
                    <CodeFeedbackBubble
                        key={bubble.id}
                        id={bubble.id}
                        content={bubble.content}
                        issue={bubble.issue}
                        onClose={() => handleCloseBubble(bubble.id)}
                        isSelected={bubble.id === selectedBubbleId}
                        onClick={handleBubbleClick}
                        isDarkMode={isDarkMode}
                        type={bubble.type}
                        fullName={bubble.fullName}
                    />
                ))}
            </div>

            </div>
            
          </div>
        </section>
      </div>
    </>
  );
};

export default StudentCodeFeedback;
