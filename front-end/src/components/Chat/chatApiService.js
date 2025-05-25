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

      const response = await axios.get(
        `http://127.0.0.1:8000/api/chat/tutor/messages/${partnerId}`,
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
              tuteur_id: msg.tuteur_id,
              etudiant_id: msg.etudiant_id,
              message: msg.message,
              read_at: msg.read_at,
              created_at: msg.created_at,
              sender_type: msg.sender_type
            }))
          }
        };
      } else {
        return {
          data: {
            success: false,
            messages: [],
            message: 'Failed to fetch messages'
          }
        };
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
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
   * Get unread messages count for the current user
   */
  getUnreadCount: async (token, role) => {
    try {
      if (!token) {
        console.error('Authentication token not found for getUnreadCount.');
        return { data: { success: false, unread_count: 0, message: 'Authentication token not found.' } };
      }
      const response = await axios.post('http://127.0.0.1:8000/api/chat/unread-count',
        { role }, // Send role in the body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data && response.data.success) {
        return { data: { success: true, unread_count: response.data.unread_count } };
      } else {
        console.error('Failed to fetch unread count:', response.data.message || 'Unknown error');
        return { data: { success: false, unread_count: 0, message: response.data.message || 'Failed to fetch unread count' } };
      }
    } catch (error) {
      console.error('Error fetching unread count:', error.response ? error.response.data : error.message);
      return { data: { success: false, unread_count: 0, message: error.response ? error.response.data.message : 'Error fetching unread count' } };
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

      // Prepare the message data and endpoint based on sender role
      let apiEndpoint;
      let apiMessageData;

      if (messageData.senderRole === 'tuteur') {
        apiEndpoint = 'http://127.0.0.1:8000/api/chat/tutor/send';
        apiMessageData = {
          etudiant_id: messageData.receiverId,
          message: messageData.content,
        };
      } else {
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
    const pusher = new Pusher('edc2943b2a2068f8b38c', {
      cluster: 'eu'
    });
    
    // Create a channel name based on the user's role and ID
    const channelName = `chat.${userId}_${userRole}`;
    const channel = pusher.subscribe(channelName);
    
    // Bind to the new message event
    channel.bind('new.message', (data) => {
      if (data && data.message) {
        console.log('Received message:', data.message);
        if (typeof onMessageReceived === 'function') {
          onMessageReceived(data.message);
        }
      }
    });
    
    return { pusher, channel };
  }
};

export default chatApiService;