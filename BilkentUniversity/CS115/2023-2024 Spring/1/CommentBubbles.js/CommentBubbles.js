import React, { useState } from "react";
import "./CommentBubbles.css"; // Ensure this path matches where your CSS file is located

const CommentBubble = ({
  id,
  lineNumber,
  codeContent,
  codeFileKey,
  initialComment = "",
  onSubmit,
  onDelete,
  studentId,
  userId,
  isDarkMode
}) => {
  const [isEditMode, setEditMode] = useState(!initialComment);
  const [comment, setComment] = useState(initialComment);
  const [submitButtonHovered, setSubmitButtonHovered] = useState(false);
  const [deleteButtonHovered, setDeleteButtonHovered] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };


  const handleSubmit = async () => {
    // Pass all necessary data to the onSubmit function
    await onSubmit(

      comment,
      lineNumber,

    );
    setEditMode(false);
  };

  const handleDelete = () => {
    onDelete(lineNumber, id); // Assuming `onDelete` takes the ID to identify which comment to delete
  };

  // Determine the CSS classes based on mode
  const bubbleClasses = `commentbubble ${isEditMode ? "moving" : ""} ${
    isDarkMode ? "dark-mode" : ""
  }`;

  return (
    <div className={bubbleClasses}>
      <h4>
        Line {lineNumber}: {codeContent}
      </h4>
      {isEditMode ? (
        <>
          <textarea
            className="chic-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
          />

          <button
            className="btn btn-primary shadow"
            role="button"
            onMouseEnter={() => setSubmitButtonHovered(true)}
            onMouseLeave={() => setSubmitButtonHovered(false)}
            style={{
              background: submitButtonHovered
                ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                : "#ffffff",
              color: submitButtonHovered ? "#ffffff" : "#a50bf6",
              boxShadow:
                "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
              borderRadius: 13,
              borderWidth: 3,
              borderColor: submitButtonHovered ? "#ffffff" : "#a50bf6",
            }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-danger shadow"
            role="button"
            onMouseEnter={() => setDeleteButtonHovered(true)}
            onMouseLeave={() => setDeleteButtonHovered(false)}
            style={{
              background: deleteButtonHovered ? "#ff0000" : "#ffffff",
              color: deleteButtonHovered ? "#ffffff" : "#ff0000",
              boxShadow: "0px 0px 8px 7px var(--bs-danger-color), 0px 0px",
              borderRadius: 13,
              borderWidth: 3,
              borderColor: deleteButtonHovered ? "#ffffff" : "#ff0000",
              marginLeft: "10px", // Space between submit and delete buttons
            }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      ) : (
        <>
          <p>{comment}</p>
          <button
            className="btn btn-danger shadow"
            role="button"
            onMouseEnter={() => setDeleteButtonHovered(true)}
            onMouseLeave={() => setDeleteButtonHovered(false)}
            style={{
              background: deleteButtonHovered ? "#ff0000" : "#ffffff",
              color: deleteButtonHovered ? "#ffffff" : "#ff0000",
              boxShadow: "0px 0px 8px 7px var(--bs-danger-color), 0px 0px",
              borderRadius: 13,
              borderWidth: 3,
              borderColor: deleteButtonHovered ? "#ffffff" : "#ff0000",
              marginLeft: "10px", // Space between submit and delete buttons
            }}
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default CommentBubble;
