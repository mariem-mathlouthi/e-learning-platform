/**
 * Mock API Service for Chat Functionality
 * 
 * This file provides mock implementations of the backend API endpoints
 * required for the chat feature. In a production environment, these would
 * be replaced with actual API calls to the backend server.
 */

import axios from 'axios';
import Pusher from 'pusher-js';

// Mock data for demonstration
const MOCK_CONTACTS = {
  student: [
    {
      id: 1,
      name: 'Prof. Ahmed',
      role: 'tutor',
      lastMessage: 'Bonjour, comment puis-je vous aider avec le cours?',
      unreadCount: 2
    },
    {
      id: 2,
      name: 'Prof. Marie',
      role: 'tutor',
      lastMessage: 'N\'oubliez pas de soumettre votre devoir avant vendredi',
      unreadCount: 0
    }
  ],
  tutor: [
    {
      id: 101,
      name: 'Étudiant Mohamed',
      role: 'student',
      lastMessage: 'Merci pour votre aide avec le projet',
      unreadCount: 0
    },
    {
      id: 102,
      name: 'Étudiant Sara',
      role: 'student',
      lastMessage: 'J\'ai une question sur le chapitre 3',
      unreadCount: 1
    },
    {
      id: 103,
      name: 'Étudiant Karim',
      role: 'student',
      lastMessage: null,
      unreadCount: 0
    }
  ]
};

const MOCK_MESSAGES = {
  'chat.1_student.1_tutor': [
    {
      id: 1,
      content: 'Bonjour, j\'ai une question sur le cours',
      sender_id: 1,
      receiver_id: 1,
      created_at: '2023-05-01T10:00:00Z'
    },
    {
      id: 2,
      content: 'Bonjour, comment puis-je vous aider avec le cours?',
      sender_id: 1,
      receiver_id: 1,
      created_at: '2023-05-01T10:05:00Z'
    }
  ],
  'chat.101_student.2_tutor': [
    {
      id: 3,
      content: 'Bonjour professeur, j\'ai besoin d\'aide avec mon projet',
      sender_id: 101,
      receiver_id: 2,
      created_at: '2023-05-02T14:30:00Z'
    },
    {
      id: 4,
      content: 'Bien sûr, dites-moi ce qui vous pose problème',
      sender_id: 2,
      receiver_id: 101,
      created_at: '2023-05-02T14:35:00Z'
    },
    {
      id: 5,
      content: 'Merci pour votre aide avec le projet',
      sender_id: 101,
      receiver_id: 2,
      created_at: '2023-05-02T15:00:00Z'
    }
  ]
};

// Mock API service
const chatApiService = {
  /**
   * Get chat contacts for the current user
   */
  getContacts: async (userId, userRole, token) => {
    try {
      // const token = localStorage.getItem('token');
      // const token = null;
      // if (userRole === 'etudiant') {
      //   token = JSON.parse(localStorage.getItem('StudentAccountInfo')).token
      // } else if (userRole === 'tuteur') {
      //   token = JSON.parse(localStorage.getItem('TuteurAccountInfo')).token
      // }

      // if (!token) {
      //   console.error('Authentication token not found.');
      //   return {
      //     data: {
      //       success: false,
      //       contacts: [],
      //       message: 'Authentication token not found.'
      //     }
      //   };
      // }
      console.log('Requesting contacts for role:', userRole);
      console.log('Using token:', token);

      // Ensure a token is available
      // The calling component should ideally pass the token.
      // This is a fallback, but relying on the passed `token` argument is preferred.
      let authToken = token;
      if (!authToken) {
        console.warn('Token not passed to getContacts, attempting to retrieve from localStorage.');
        if (userRole === 'etudiant') {
          const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
          authToken = studentInfo ? studentInfo.token : null;
        } else if (userRole === 'tuteur') {
          const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
          authToken = tuteurInfo ? tuteurInfo.token : null;
        }
      }

      if (!authToken) {
        console.error('Authentication token not found.');
        return {
          data: {
            success: false,
            contacts: [],
            message: 'Authentication token not found.'
          }
        };
      }

      const response = await axios.get(`http://localhost:8000/api/chat/contacts/${userRole}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        }
      );

      console.log(response)
      if (response.data && response.data.success) {
        // Transform the response to match our component's expected format
        // The new API response already provides 'fullname' as 'name' and 'id'
        // It also seems to provide 'image', which we can add if needed.
        // The 'role' for contacts will be the opposite of currentUserRole, or determined by API if provided.
        return {
          data: {
            success: true,
            contacts: response.data.contacts.map(contact => ({
              id: contact.id,
              name: contact.fullname, // API provides fullname
              role: userRole === 'etudiant' ? 'tuteur' : 'etudiant', // Assuming contacts are the other role
              image: contact.image || null, // Use image if provided
              lastMessage: null, // This might need to be fetched or updated separately
              unreadCount: 0 // This might need to be fetched or updated separately
            }))
          }
        };
      } else {
        console.error('Failed to fetch contacts:', response.data.message || 'Unknown error');
        return {
          data: {
            success: false,
            contacts: [],
            message: response.data.message || 'Failed to fetch contacts'
          }
        };
      }
    } catch (error) {
      console.error('Error fetching contacts:', error.response ? error.response.data : error.message);
      return {
        data: {
          success: false,
          contacts: [],
          message: error.response ? error.response.data.message : 'Error fetching contacts'
        }
      };
    }
  },

  getChatHistory: async (currentUserId, currentUserRole, partnerId, partnerRole) => {
    try {
      let authToken;
      if (currentUserRole === 'tuteur') {
        const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
        authToken = tuteurInfo ? tuteurInfo.token : null;
      } else {
        const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
        authToken = studentInfo ? studentInfo.token : null;
      }

      if (!authToken) {
        console.error('Authentication token not found.');
        return {
          data: {
            success: false,
            messages: [],
            message: 'Authentication token not found.'
          }
        };
      }

      // Determine the correct API endpoint based on the current user's role
      // The original code always used the tutor messages endpoint, which might be incorrect if a student is fetching.
      // Assuming the backend has distinct endpoints or handles role differentiation based on the token.
      // For this example, I'll assume the endpoint needs to be dynamic or the backend handles it.
      // If there are separate endpoints like /api/chat/student/messages/{partnerId}, that should be used.
      // For now, keeping the original endpoint but noting this potential issue.
      const response = await axios.get(
        `http://127.0.0.1:8000/api/chat/${currentUserRole}/messages/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (response.data.success) {
        return {
          data: {
            success: true,
            messages: response.data.data.map(msg => ({
              id: msg.id,
              // Ensure consistent naming if backend provides sender_id/receiver_id or tuteur_id/etudiant_id
              tuteur_id: msg.tuteur_id, 
              etudiant_id: msg.etudiant_id,
              message: msg.message,
              read_at: msg.read_at,
              created_at: msg.created_at,
              sender_type: msg.sender_type // This indicates who sent the message
            }))
          }
        };
      } else {
        return {
          data: {
            success: false,
            messages: [],
            message: response.data.message || 'Failed to fetch messages'
          }
        };
      }
    } catch (error) {
      console.error('Error fetching chat history:', error.response ? error.response.data : error.message);
      return {
        data: {
          success: false,
          messages: [],
          message: error.response ? error.response.data.message : 'Error fetching chat history'
        }
      };
    }
  },

  /**
   * Get unread messages count for the current user.
   * This will return total unread count and unread count per user.
   * @param {string} token - Authentication token.
   * @param {string} currentUserRole - Role of the current user ('student' or 'tutor').
   * @returns {Promise<Object>} - Promise resolving to the API response.
   */
  getUnreadCount: async (token, currentUserRole) => {
    if (!token) {
      console.error('Authentication token not found for getUnreadCount.');
      return { 
        data: { 
          success: false, 
          message: 'Authentication token not found.', 
          total_unread_count: 0, 
          unread_by_user: [] 
        } 
      };
    }

    const apiUrl = `http://127.0.0.1:8000/api/chat/unread-count/${currentUserRole}`;

    try {
      const response = await axios.get(apiUrl, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        return { 
          data: { 
            success: true, 
            total_unread_count: response.data.total_unread_count || 0,
            unread_by_user: response.data.unread_by_user || []
          } 
        };
      } else {
        console.error('Failed to fetch unread count:', response.data.message || 'Unknown error');
        return { 
          data: { 
            success: false, 
            message: response.data.message || 'Failed to fetch unread count', 
            total_unread_count: 0,
            unread_by_user: []
          } 
        };
      }
    } catch (error) {
      console.error('Error fetching unread count:', error.response ? error.response.data : error.message);
      return { 
        data: { 
          success: false, 
          message: error.response ? error.response.data.message : 'Error fetching unread count', 
          total_unread_count: 0,
          unread_by_user: []
        } 
      };
    }
  },

  sendMessage: async (messageData) => {
    try {
      // Get the appropriate token based on user role
      let authToken;
      if (messageData.senderRole === 'tuteur') {
        const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
        authToken = tuteurInfo ? tuteurInfo.token : null;
      } else {
        const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
        authToken = studentInfo ? studentInfo.token : null;
      }

      if (!authToken) {
        console.error('Authentication token not found.');
        return {
          data: {
            success: false,
            message: 'Authentication token not found.'
          }
        };
      }
      // Removed duplicate authToken check

      // Prepare the message data and endpoint based on sender role
      let apiEndpoint;
      let apiMessageData;

      if (messageData.senderRole === 'tuteur') {
        apiEndpoint = 'http://127.0.0.1:8000/api/chat/tutor/send';
        apiMessageData = {
          etudiant_id: messageData.receiverId,
          message: messageData.content,
        };
      } else { // Assuming senderRole is 'etudiant' or similar for the student
        apiEndpoint = 'http://127.0.0.1:8000/api/chat/student/send';
        apiMessageData = {
          tuteur_id: messageData.receiverId,
          message: messageData.content,
        };
      }

      // Send the message to the server
      const response = await axios.post(
        apiEndpoint,
        apiMessageData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Removed duplicate logic for apiEndpoint, apiMessageData, and axios.post

      if (response.data && response.data.success) {
        return {
          data: {
            success: true,
            message: 'Message sent successfully',
            messageData: {
              id: response.data.message.id,
              tuteur_id: response.data.message.tuteur_id,
              etudiant_id: response.data.message.etudiant_id,
              message: response.data.message.message,
              read_at: response.data.message.read_at,
              created_at: response.data.message.created_at,
              sender_type: response.data.message.sender_type
            }
          }
        };
      } else {
        console.error('Failed to send message:', response.data.message || 'Unknown error');
        return {
          data: {
            success: false,
            message: response.data.message || 'Failed to send message'
          }
        };
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
      return {
        data: {
          success: false,
          message: error.response ? error.response.data.message : 'Error sending message'
        }
      };
    }
  },

  initializePusher: (userId, userRole, onMessageReceived) => {
    // Initialize Pusher with your app key
    const pusher = new Pusher('edc2943b2a2068f8b38c', { // Ensure this is your correct Pusher App Key
      cluster: 'eu' // Ensure this is your correct Pusher cluster
    });
    
    // Create a channel name based on the user's role and ID
    // Example: chat.1_student or chat.5_tutor
    // The backend should publish to a channel name that matches this format for the specific recipient.
    const channelName = `chat.${userId}_${userRole}`; 
    console.log(`Subscribing to Pusher channel: ${channelName}`);
    const channel = pusher.subscribe(channelName);
    
    // Bind to the new message event (e.g., 'new.message' or your specific event name from backend)
    channel.bind('new.message', (data) => { // Ensure 'new.message' is the event name your backend triggers
      if (data && data.message) {
        console.log('Received message via Pusher:', data.message);
        if (typeof onMessageReceived === 'function') {
          // The received message should ideally have a structure consistent with other messages
          // e.g., { id, sender_id, receiver_id, content, created_at, sender_type }
          // The current 'data.message' might be just the content or the full message object.
          // Adjust based on what the backend sends.
          onMessageReceived(data); 
        }
      } else {
        console.warn('Received empty or malformed message data via Pusher:', data);
      }
    });

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`Successfully subscribed to ${channelName}`);
    });

    channel.bind('pusher:subscription_error', (status) => {
      console.error(`Failed to subscribe to ${channelName}, status: ${status}`);
    });
    
    return { pusher, channel };
  },

  /**
   * Mark messages as read
   * @param {string} token - Authentication token
   * @param {Array|number} messageIds - Single message ID or array of message IDs to mark as read
   * @returns {Promise} - Promise resolving to the API response
   */
  markMessagesAsRead: async (token, messageIds) => {
    try {
      if (!token) {
        console.error('Authentication token not found for markMessagesAsRead.');
        return { 
          data: { 
            success: false, 
            message: 'Authentication token not found.' 
          } 
        };
      }

      // Convert single ID to array if needed
      const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
      
      const response = await axios.post('http://127.0.0.1:8000/api/chat/mark-read',
        { message_ids: ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        return { 
          data: { 
            success: true, 
            message: 'Messages marked as read successfully' 
          } 
        };
      } else {
        console.error('Failed to mark messages as read:', response.data.message || 'Unknown error');
        return { 
          data: { 
            success: false, 
            message: response.data.message || 'Failed to mark messages as read' 
          } 
        };
      }
    } catch (error) {
      console.error('Error marking messages as read:', error.response ? error.response.data : error.message);
      return { 
        data: { 
          success: false, 
          message: error.response ? error.response.data.message : 'Error marking messages as read' 
        } 
      };
    }
  }
};

export default chatApiService;