import React, {useEffect, useRef, useState} from 'react';
import './Recommendations.css';
import { BulbOutlined } from '@ant-design/icons';
import recommendationData from './assets/img/chatbot/recommendation-loader.json';
import lottie from 'lottie-web';

function RecommendationButton({ text, subtext, onClick }) {
  return (
    <button className="recommendation-button" onClick={() => onClick(text)}>
      <BulbOutlined className="icon-style" />
      <div>
        <div className="button-text">{text}</div>
        <div className="button-subtext">{subtext}</div>
      </div>
    </button>
  );
}

function Recommendations({ lab_id, onSelectRecommendation }) {
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendedQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/labs/${lab_id}/recommendations`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        const data = await response.json();
        setRecommendedQuestions(data); // Assuming the data format matches the expected structure
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
      setLoading(false);
    };

    fetchRecommendedQuestions();
  }, [lab_id]);

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



  return (
    <div className="recommendations-container">
      {loading ? (
        <div className="lottie-container">
          <LottieAnimation animationData={recommendationData}/>
        </div>
      ) : (
        <div className="recommendations">
          {recommendedQuestions.length > 0 ? (
            recommendedQuestions.map((option, index) => (
              <RecommendationButton
                key={index}
                text={option.text}
                subtext={option.subtext}
                onClick={onSelectRecommendation}
              />
            ))
          ) : (
            <p></p>
          )}
        </div>
      )}
    </div>
  );

}

export default Recommendations;
