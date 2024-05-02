import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import Landing from './Landing';
import Chatbot from './Chatbot';
import Login from './Login';
import Profile from './Profile';
import ForgetPassword from './ForgetPassword';
import AddCourse from './AddCourse';
import UploadedLab from './UploadedLab';
import { StudentDashboard } from './StudentDashboard';
import SignUp from './SignUp';
import { CoursePage } from './CoursePage';
import { LabPage } from './LabPage';
import ViewUploadedLabs from './ViewUploadedLabs';
import CodeAnalysisUpload from './CodeAnalysisUpload';
import CodeAnalysis from './CodeAnalysis';
import CodeInspection from './CodeInspection';
import TwoFaAuth from "./TwoFaAuth";
import TwoFaAuthScan from "./TwoFaAuthScan"
import TwoFaAuthSet from "./TwoFaAuthSet"
import { InstructorDashboard } from './InstructorDashboard';
import { TaDashboard } from './TaDashboard';
import { UploadForSimilarity } from './UploadforSimilarity';
import { SimilarityResults } from './SimilarityResults';
import SignUpCont from './SignUpCont';
import { LabPageInst } from './LabPageInst';
import { TestCases } from './TestCases';
import { AddTestCase } from './AddTestCase';
import { CreateNewLab } from './CreateNewLab';
import { AllStudentsTestCase } from './AllStudentsTestCase';
import StudentCodeFeedback from './StudentCodeFeedback';
import AnalyticDashboardsMain from "./AnalyticDashboardsMain";
import ChatbotTotalCostDashboard from "./ChatbotTotalCostDashboard";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import ForgetPasswordAuth  from "./ForgetPasswordAuth";
import ForgetPasswordSet from "./ForgetPasswordSet";

function App() {
  useEffect(() => {
    document.title = 'CODED.';
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login/>} />
        <Route path="/profile" 
          element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } 
        />
        <Route path='/forgetpassword' element={<ForgetPassword/>} />
          <Route path='/forgetpasswordAuth/email/:email' element={<ForgetPasswordAuth/>} />
           <Route path='/forgetpasswordSet/email/:email' element={<ForgetPasswordSet/>} />
        <Route path="/addCourse" 
          element={
            <ProtectedRoute><AddCourse /></ProtectedRoute>
          } 
        />
        <Route path="/dashboardStu" 
          element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } 
        />
         <Route path="/dashboardInst" 
          element={
            <ProtectedRoute><InstructorDashboard /></ProtectedRoute>
          } 
        />
         <Route path="/course/:courseId/labs" 
          element={
            <ProtectedRoute><CoursePage /></ProtectedRoute>
          } 
        />
        <Route path='/labPage/:labId'
          element={
            <ProtectedRoute><LabPage /></ProtectedRoute>
          } 
        />
        <Route path='/viewuploadedlabs'
          element={
            <ProtectedRoute><ViewUploadedLabs /></ProtectedRoute>
          } 
        />
        <Route path='/labpageinst'
          element={
            <ProtectedRoute><LabPageInst /></ProtectedRoute>
          } 
        />
          <Route path="/createnewlab/:courseId"
          element={
            <ProtectedRoute><CreateNewLab/></ProtectedRoute>
          } 
        />
        <Route path="/labs/:lab_id/chats/:current_chat_id"
          element={
            <ProtectedRoute><Chatbot/></ProtectedRoute>
          }
        />
        <Route path="/labs/:lab_id/chats/"
          element={
            <ProtectedRoute><Chatbot/></ProtectedRoute>
          }
        />
        <Route path="/chats/"
          element={
            <ProtectedRoute><Chatbot/></ProtectedRoute>
          }
        />
        <Route path='/signUp' element={<SignUp/>} />
        <Route path='/signUpCont' element={<SignUpCont/>} />
        <Route path='/tadashboard' element={<TaDashboard/>} />
        {/* <Route path='/course' element={<CoursePage/>} /> */}
        {/* <Route path='/uploadedLab' element={<UploadedLab/>} /> */}
        {/* <Route path='/labPage' element={<LabPage/>} /> */}
        <Route path='/codeanalysisupload' element={<CodeAnalysisUpload/>} />
        <Route path='/codeanalysis' element={<CodeAnalysis/>} />
        <Route path='/uploadforsimilarity' element={<UploadForSimilarity/>} />
        <Route path='/similarityresults' element={<SimilarityResults/>} />
          {/*<Route path='/testcases' element={<TestCases/>} />*/}
          {/*<Route path='/addtestcase' element={<AddTestCase/>} />*/}
          <Route path='/addtestcase/:labId' element={<AddTestCase/>} />
        {/* <Route path='/createnewlab' element={<CreateNewLab/>} /> */}
        <Route path='/codeinspection' element={<CodeInspection/>} />
        <Route path='/allStudentsTestCase/:courseId/:labId' element={<AllStudentsTestCase/>} />
        <Route path='/testCases/:labId' element={<TestCases/>} />
        <Route path='/labPageInst/:labId' element={<LabPageInst/>} />
        <Route path="/ViewUploadedLabs/:courseId" element={<ViewUploadedLabs />} />
        <Route path='/AnalyticDashboards' element={<AnalyticDashboardsMain/>} />
        <Route path='/AnalyticDashboards/Chatbot/TotalCostDashboard' element={<ChatbotTotalCostDashboard/>} />
        <Route path='/StudentCodeFeedback' element={<StudentCodeFeedback/>} />
        <Route path="/Login/Challenge/:userID/Auth" element={<TwoFaAuth/>} />
        <Route path="/Login/Challenge/:userID/Set" element={<TwoFaAuthSet/>} />
        <Route path="/Login/Challenge/:userID/Scan" element={<TwoFaAuthScan/>} />
  
        {/* <Route path="/user/:userId" element={<Profile />} /> */}
        <Route path="/api" render={() => null} />
         <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
