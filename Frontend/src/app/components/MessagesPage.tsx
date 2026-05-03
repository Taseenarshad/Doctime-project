import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Stethoscope,
  Shield,
  LogOut,
} from 'lucide-react';

interface MessagesPageProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function MessagesPage({
  user,
  onLogout,
  onNavigate,
}: MessagesPageProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<Record<string, any>>({});
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${user.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load messages');
        setLoadingMessages(false);
        return;
      }

      setMessages(data.messages || []);
      setParticipants(data.participants || {});
    } catch (error) {
      setErrorMessage('Could not load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/messages/contacts/${user.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load contacts');
        return;
      }

      setContacts(data.contacts || []);
    } catch (error) {
      setErrorMessage('Could not load contacts');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchContacts();
  }, [user.id]);

  const conversations = useMemo(() => {
    const map = new Map<number, any>();

    contacts.forEach((contact) => {
      map.set(contact.id, {
        id: contact.id,
        name: contact.name,
        role: contact.role,
        lastMessage: '',
        timestamp: '',
      });
    });

    messages.forEach((message) => {
      const otherUserId =
        message.sender_id === user.id
          ? message.receiver_id
          : message.sender_id;

      const otherParticipant = participants[String(otherUserId)] || participants[otherUserId];

      map.set(otherUserId, {
        id: otherUserId,
        name: otherParticipant?.name || map.get(otherUserId)?.name || `User #${otherUserId}`,
        role: otherParticipant?.role || map.get(otherUserId)?.role || 'user',
        lastMessage: message.content,
        timestamp: message.created_at,
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [messages, participants, contacts, user]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const threadMessages = messages.filter((message) => {
    return (
      (message.sender_id === user.id &&
        message.receiver_id === selectedConversationId) ||
      (message.receiver_id === user.id &&
        message.sender_id === selectedConversationId)
    );
  });

  const handleBack = () => {
    if (user.role === 'patient') {
      onNavigate('patient-dashboard');
    } else if (user.role === 'doctor') {
      onNavigate('doctor-dashboard');
    } else {
      onNavigate('admin-dashboard');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const selectedParticipant =
      conversations.find((c) => c.id === selectedConversationId);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sender_id: user.id,
          sender_role: user.role,
          receiver_id: selectedConversationId,
          receiver_role: selectedParticipant?.role || 'patient',
          content: newMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to send message');
        return;
      }

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'doctor') {
      return <Stethoscope className="w-5 h-5 text-blue-600" />;
    }

    if (role === 'patient') {
      return <User className="w-5 h-5 text-green-600" />;
    }

    return <Shield className="w-5 h-5 text-purple-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-600">DocTime</h1>
          <p className="text-gray-500 mt-2">Messages</p>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={handleBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Messages</h2>
          <p className="text-gray-500 mt-2">
            {user.role === 'admin'
              ? 'Message any user or doctor in the system'
              : 'Communicate through the platform'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Conversations
            </h3>

            {loadingMessages ? (
              <p className="text-gray-500">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-gray-500">No conversations yet.</p>
            ) : (
              <div className="space-y-3 max-h-[650px] overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() =>
                      setSelectedConversationId(conversation.id)
                    }
                    className={`w-full text-left border rounded-2xl p-4 transition-colors ${
                      selectedConversationId === conversation.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getRoleIcon(conversation.role)}
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {conversation.name}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {conversation.role}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col min-h-[650px]">
            {selectedConversation ? (
              <>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(selectedConversation.role)}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {selectedConversation.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {threadMessages.length === 0 ? (
                    <div className="text-gray-500 text-sm">
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    threadMessages.map((message) => {
                      const isSelf = message.sender_id === user.id;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isSelf
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              isSelf
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) =>
                        setNewMessage(e.target.value)
                      }
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                    />

                    <button
                      onClick={handleSendMessage}
                      className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}