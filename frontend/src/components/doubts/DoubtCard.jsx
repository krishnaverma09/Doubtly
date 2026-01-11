import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Edit2, Trash2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, User } from 'lucide-react';

const DoubtCard = ({ doubt, user, onUpvote, onEdit, onDelete, onAnswer, onEditAnswer, onDeleteAnswer, onImageClick }) => {
  const [showReplies, setShowReplies] = useState(false);
  const isUpvoted = (doubt.upvotes || []).includes(user.id || user._id);
  const isOwner = (doubt.student?._id || doubt.student) === user.id;
  
  const myAnswer = (doubt.answers || []).find(a => (a.teacher?._id || a.teacher) === user.id);
  const isAnsweredByMe = !!myAnswer;
  const hasAnswers = doubt.answers && doubt.answers.length > 0;

  const getStatusBadge = (status) => {
    if (!hasAnswers && status === 'answered') {
      return <span className="status-badge status-open">Open</span>;
    }
    switch(status) {
      case 'answered': return <span className="status-badge status-solved">Solved</span>;
      case 'in-progress': return <span className="status-badge status-in-progress">In Progress</span>;
      default: return <span className="status-badge status-open">Open</span>;
    }
  };

  const getStatusIcon = (status) => {
    if (!hasAnswers && status === 'answered') {
      return <AlertCircle size={14} className="status-open-icon" />;
    }
    switch(status) {
      case 'answered': return <CheckCircle size={14} className="status-solved-icon" />;
      case 'in-progress': return <Clock size={14} className="status-progress-icon" />;
      default: return <AlertCircle size={14} className="status-open-icon" />;
    }
  };

  return (
    <div className="doubt-card">
      <div className="card-top">
        {getStatusBadge(doubt.status)}
        <span className="subject-tag">{doubt.subject}</span>
      </div>

      <h3 className="doubt-title">{doubt.title}</h3>
      <p className="doubt-desc">{doubt.description}</p>

      {doubt.media && doubt.media.length > 0 && doubt.media.some(m => m.url) && (
        <div className="card-media">
          {doubt.media.map((item, idx) => {
            const type = item.mediaType || item.type;
            if (type === 'image') return (
              <img 
                key={idx} 
                src={item.url} 
                alt="doubt" 
                onClick={() => onImageClick(item.url)}
                style={{ cursor: 'zoom-in' }}
              />
            );
            if (type === 'video') return <video key={idx} src={item.url} controls />;
            return null;
          })}
        </div>
      )}

      {doubt.answers && doubt.answers.length > 0 && (
        <div className="replies-container">
          <button 
            className="toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            <MessageSquare size={16} />
            {showReplies ? 'Hide' : 'View'} {doubt.answers.length} {doubt.answers.length === 1 ? 'Reply' : 'Replies'}
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showReplies && (
            <div className="replies-list">
              {doubt.answers.map((ans, index) => (
                <div key={ans._id || index} className="reply-section">
                  <div className="reply-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="teacher-avatar-mini">
                        <User size={12} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="teacher-name">{ans.teacher?.name || 'Teacher'}</span>
                        <span className="reply-date">{new Date(ans.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {user.role === 'teacher' && (ans.teacher?._id || ans.teacher) === user.id && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => onEditAnswer(doubt, ans)} className="reply-action-btn"><Edit2 size={14} /></button>
                        <button onClick={() => onDeleteAnswer(doubt._id)} className="reply-action-btn delete"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                  <div className="reply-content">
                    <p>{ans.text}</p>
                    {ans.media && ans.media.length > 0 && (
                      <div className="reply-media">
                        {ans.media.map((item, idx) => {
                          const type = item.mediaType || item.type;
                          if (type === 'image') return (
                            <img 
                              key={idx} 
                              src={item.url} 
                              alt="answer" 
                              onClick={() => onImageClick(item.url)}
                              style={{ cursor: 'zoom-in' }}
                            />
                          );
                          if (type === 'video') return <video key={idx} src={item.url} controls />;
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card-footer">
        <div className="engagement">
          <button 
            className={`engage-btn ${isUpvoted ? 'upvoted' : ''}`}
            onClick={() => onUpvote(doubt._id)}
          >
            <ThumbsUp size={18} fill={isUpvoted ? "currentColor" : "none"} />
            {doubt.upvotes?.length || 0}
          </button>
          <div className="engage-btn">
            <MessageSquare size={18} />
            {(doubt.answers?.length || 0)} {doubt.answers?.length === 1 ? 'reply' : 'replies'}
          </div>
        </div>

        <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
          {user.role === 'student' && isOwner && (doubt.answers?.length === 0) && (
            <>
              <button onClick={() => onEdit(doubt)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={16} /></button>
              <button onClick={() => onDelete(doubt._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
            </>
          )}
          
          {user.role === 'teacher' && !isAnsweredByMe && (
            <button 
              className="submit-btn" 
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              onClick={() => onAnswer(doubt)}
            >
              Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;
