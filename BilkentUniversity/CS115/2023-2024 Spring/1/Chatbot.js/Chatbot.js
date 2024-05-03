import React, { useState, useEffect, useRef  } from "react";
import "./Chatbot.css";
import Recommendations from "./Recommendations";
import Sidebar from "./Sidebar";
import ChatbotNavBar from "./ChatbotNavbar";
import botLogoUrl from "./assets/img/chatbot/logo.png";
import ReactMarkdown from 'react-markdown';
import lottie from 'lottie-web';
import animationData from './assets/img/chatbot/loader-chat.json'
import voiceLoadingData from './assets/img/chatbot/voice-loading.json'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  UpCircleOutlined,
  AudioOutlined,
  LikeOutlined,
  DislikeOutlined,
  CheckOutlined,
  CloseSquareOutlined


} from "@ant-design/icons";
import { Button, Tooltip, notification } from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import WelcomeMessage from "./WelcomeMessage";




const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <div style={{ marginBottom: '10px' }}>
      <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};


const LottieAnimation = ({ animationData }) => {
    const animationContainer = useRef(null);
    const anim = useRef(null);

    useEffect(() => {
        anim.current = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
        });

        return () => anim.current.destroy();
    }, [animationData]);

    return <div ref={animationContainer}></div>;
};

const renderers = {
  code: CodeBlock
};

const formatDate = (dateString) => {
  const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  return new Date(dateString).toLocaleString('en-GB', options);
};




const Message = ({ id, content, isUser, timestamp, botLogoUrl, isError, audioEnabled }) => {
  const [api, contextHolder] = notification.useNotification();
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);




  const handleEvaluation = async (messageId, messageContent, rating) => {
    const payload = {
    message_id: messageId,
    rating: rating,
    text: messageContent,
  };
    try {
      const response = await fetch('http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/message/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        api.open({
          message: 'Evaluation Successful',
          description: `Your message evaluation has been recorded.`,
           icon: <CheckOutlined />,
          duration: 2,
        });
      } else {
        throw new Error('Failed to submit evaluation');
      }
    } catch (error) {
      api.open({
        message: 'Evaluation Failed',
        description: 'There was a problem submitting your message evaluation.',
        icon: <CloseSquareOutlined />,
        duration: 2,
      });
    }
  };

  const handleAudioPlay = async (messageId, responseSent) => {
  try {
    setLoading(true);
    const encodedResponse = encodeURIComponent(responseSent);
    const generateUrl = `http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/message/voice/generate?message_id=${messageId}&response_sent=${encodedResponse}`;
    const generateResponse = await fetch(generateUrl, {
      method: 'POST'
    });

    if (generateResponse.ok) {
      const getUrl = `http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/message/voice/get_url?message_id=${messageId}`;
      const getUrlResponse = await fetch(getUrl);

      if (getUrlResponse.ok) {
        const data = await getUrlResponse.json();
        setAudioUrl(data.url);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch audio URL');
      }
    } else {
      throw new Error('Failed to initiate audio generation');
    }
  } catch (error) {
    console.error("Audio Play Error: ", error);
    api.open({
      message: 'Audio Load Failed',
      description: 'There was a problem fetching audio content: ' + error.message,
      icon: <CloseSquareOutlined />,
      duration: 2,
    });
  }
};


  return (
  <div className={`message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''}`}>
    {contextHolder}
    <div className="message-avatar">
      {!isUser && <img src={botLogoUrl} alt="Bot" className="bot-avatar" />}
    </div>
    <div className="message-content">
      <ReactMarkdown children={content} components={renderers}/>
      {isLoading ? (
          <div className="lottie-container-voice-loading">
            <LottieAnimation animationData={voiceLoadingData}/>
          </div>
      ) : audioUrl ? (
          <audio src={audioUrl} controls autoPlay>
            Your browser does not support the audio element.
          </audio>
      ) : null}
      <div className="message-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {!isUser && (
            <div className="message-actions" style={{flexGrow: 1}}>
              {audioEnabled && (
                  <Tooltip title="Listen to Message">
                    <Button type="link" icon={<AudioOutlined/>} onClick={() => handleAudioPlay(id, content)}/>
                  </Tooltip>
              )}
              <Tooltip title="Evaluate as good response">
                <Button type="link" icon={<LikeOutlined/>} onClick={() => handleEvaluation(id, content, 'good')}/>
              </Tooltip>
              <Tooltip title="Evaluate as bad response">
                <Button type="link" icon={<DislikeOutlined/>} onClick={() => handleEvaluation(id, content, 'bad')}/>
              </Tooltip>
            </div>
        )}
        <span className="message-timestamp">{formatDate(timestamp)}</span>
      </div>
    </div>
  </div>
  );

};


const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [chats, setChats] = useState([{ id: 'chat1', title: 'Initial Chat', messages: [] }]);
  const {current_chat_id} =  useParams();
  const {lab_id} = useParams();
  const [coding_language , set_coding_language] = useState("")
  const messageEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [voice_response_status, setVoiceResponseDetail] = useState(null);



  const user_id = localStorage.getItem('userId')




function updateLocalMessages(newMessage) {
  setMessages(messages => [...messages, {
    ...newMessage,
    id: Math.random(),
    entry_date: new Date().toISOString(),
    role: "user",
  }]);
}

  useEffect(() => {
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/${current_chat_id}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setIsLoading(false);
  };

  fetchMessages();
}, [current_chat_id]);


  const scrollToBottom = () => {
  if (messageEndRef.current) {
     window.scrollTo(0, messageEndRef.current.offsetTop);
  }
};

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  useEffect(() => {
    const fetchLabCodingLanguage = async () => {
      try {
        const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/labs/${lab_id}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch coding language');
        }
        const data = await response.json();
        set_coding_language(data.language)
      } catch (error) {
        console.error('Error fetching lab coding language:', error);
      }
    };

    fetchLabCodingLanguage();
  }, [lab_id]);


  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.add("no-scroll");
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const chatWindow = document.querySelector('.chat-window');
    if(chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/active/${user_id}/details`);
        if (!response.ok) { // noinspection ExceptionCaughtLocallyJS
          throw new Error('Failed to fetch chats');
        }
        let data = await response.json();

        setChats(data);

      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user_id]);

  const fetchChats = async () => {
      try {
        const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/active/${user_id}/details`);
        if (!response.ok) { // noinspection ExceptionCaughtLocallyJS
          throw new Error('Failed to fetch chats');
        }
        let data = await response.json();

        setChats(data);
        return data;

      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

  const startNewChatSubmit = async () => {
    const chatData = {
      added_by: "user",
      student_id: user_id,
    };

    try {
      const response = await fetch('http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create a new chat: ${response.statusText}`);
      }

      const data = await fetchChats();
      const currentChatId = data[0].id;
      navigate(`/labs/${lab_id}/chats/${currentChatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  const startNewChat = async () => {
    const chatData = {
      added_by: "user",
      is_active: true,
      student_id: user_id,
      chat_title: `New Chat`,
      entry_date : new Date(),
    };

    try {
      const response = await fetch('http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {

        throw new Error(`Failed to create a new chat: ${response.statusText}`);
      }
      await fetchChats();
      setMessages(response.id)
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };


  const deleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
  };


  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  if (!current_chat_id) {
     await startNewChatSubmit();
     return;
  }

  const messageData = {
    chat_id: current_chat_id,
    body: query,
    added_by: "user",
    coding_language: coding_language
  };
   updateLocalMessages(messageData);
   setQuery("");
   setIsBotThinking(true);
  try {
    await generateBotResponse(messageData);
    await fetchMessages(current_chat_id);
    setIsBotThinking(false);

  } catch (error) {
    console.error('Error during message handling:', error);
    setIsBotThinking(false);
  }
  finally {
    setIsBotThinking(false);
    await fetchChats();
  }

};

const generateBotResponse = async (messageData) => {
  const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/message/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData)
  });

  if (!response.ok) {
    throw new Error(`Error from backend API: ${response.statusText}`);
  }
};

const fetchMessages = async (chatId) => {
  const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/chats/${chatId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const messages = await response.json();
  setMessages(messages);
};

const fetchLabVoiceDetail = async (lab_id) => {
  const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/labs/${lab_id}/details/voice_response`)
  if (!response.ok)
  {
    throw  new Error('Failed to fetch lab voice detail.');
  }
  const voice_response_status = await response.json();
  setVoiceResponseDetail(voice_response_status['voice_response_enabled'])

}

useEffect(() => {
    const fetchLabVoiceDetail = async (lab_id) => {
    const response = await fetch(`http://ec2-52-70-156-27.compute-1.amazonaws.com:8000/labs/${lab_id}/details/voice_response`)
      if (!response.ok)
      {
        throw  new Error('Failed to fetch lab voice detail.');
      }
    const voice_response_status = await response.json();
    setVoiceResponseDetail(voice_response_status['voice_response_enabled'])
  }
    fetchLabVoiceDetail(lab_id);
    }, [lab_id]);



  const simulateBotResponseToRecommendation = async (recommendation) => {
    const new_message = {
      chat_id: current_chat_id,
      body: recommendation,
      added_by: "user",
      coding_language: coding_language
    };
      updateLocalMessages(new_message);
     setIsBotThinking(true);
      try {
        await generateBotResponse(new_message);
        await fetchMessages(current_chat_id);
        setIsBotThinking(false);

      } catch (error) {
        console.error('Error during message handling:', error);
        setIsBotThinking(false);
      }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


const handleRecommendationSelect = (recommendation) => {
    simulateBotResponseToRecommendation(recommendation);

};

  return (
      <div>
        <ChatbotNavBar activeSection="chatbot" lab_id={lab_id} user_id={user_id} />
        <section className="py-4 py-md-4 my-5">
          <div className={`page ${sidebarOpen ? "open" : "close"}`}>
            <Sidebar
                chats={chats}
                setChats={setChats}
                chat_id={current_chat_id}
                deleteChat={deleteChat}
                startNewChat={startNewChat}
                student_id={user_id}
                lab_id={lab_id}
            />
            <div className="content">
              {!sidebarOpen ? (
                  <DoubleRightOutlined
                      style={{fontSize: "30px", marginTop: "20px"}}
                      onClick={toggleSidebar}
                  />
              ) : (
                  <DoubleLeftOutlined
                      style={{fontSize: "30px", marginTop: "20px"}}
                      onClick={toggleSidebar}
                  />
              )}
              <main className="main">
                <div className="chat-window">
                    {isLoading ? (
                        <div className="animation-container">
                        <LottieAnimation animationData={animationData}/>
                        </div>
                    ) : (
                        <div className="messages">
                          {messages.map((msg, index) => (
                              <Message
                                  key={msg.id}
                                  id={msg.id}
                                  content={msg.body}
                                  isUser={msg.role === 'user'}
                                  timestamp={new Date(msg.entry_date).toLocaleString()}
                                  botLogoUrl={botLogoUrl}
                                  isError={msg.isError || false}
                                  audioEnabled={voice_response_status}
                                  messageEndRef={index === messages.length - 1 ? messageEndRef : undefined}
                              />
                          ))}
                          {isBotThinking && (
                              <div className="bot-thinking">
                                <div className="loader"></div>
                              </div>
                          )}
                        </div>)}
                        {messages.length === 0 && (
                            <div>
                              <WelcomeMessage user={user_id}/>
                              <Recommendations onSelectRecommendation={handleRecommendationSelect} lab_id={lab_id}/>
                            </div>
                        )}
                  <form onSubmit={handleSubmit} className="message-form">
                    <input
                        type="text"
                        placeholder="Type your question..."
                        value={query}
                        onChange={handleInputChange}
                    />
                      <button type="submit">
                        <UpCircleOutlined/>
                      </button>
                    </form>
                  </div>
              </main>
              <div className="response-time-note">
                <p>We're on it! Response times may vary between 5-15 seconds.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
  );

};

export default Chatbot;
