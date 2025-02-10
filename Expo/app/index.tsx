import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';

import io, { Socket } from 'socket.io-client';

interface Message {
  text: string;
  type: 'user' | 'other' | 'join' | 'left';
}

export default function ChatScreen() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, type: 'other' }]);
    });

    newSocket.on('join', (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, type: 'join' }]);
    });

    newSocket.on('left', (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, type: 'left' }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chat', message);
      setMessages((prev) => [...prev, { text: message, type: 'user' }]);
      setMessage('');
    }
  };

  const getMessageStyle = (type: Message['type']): ViewStyle => {
    const baseStyle = {
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
      marginVertical: 4,
    };

    switch (type) {
      case 'user':
        return {
          ...baseStyle,
          backgroundColor: '#FF9500',
          alignSelf: 'flex-end',
        } as ViewStyle;
      case 'other':
        return {
          ...baseStyle,
          backgroundColor: '#E5E5EA',
          alignSelf: 'flex-start',
        } as ViewStyle;
      case 'join':
        return {
          ...baseStyle,
          backgroundColor: '#34C759',
          alignSelf: 'center',
        } as ViewStyle;
      case 'left':
        return {
          ...baseStyle,
          backgroundColor: '#FF3B30',
          alignSelf: 'center',
        } as ViewStyle;
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={getMessageStyle(item.type)}>
      <Text style={{ color: item.type === 'other' ? '#000' : '#FFF' }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: 10,
              marginRight: 10,
              borderRadius: 20,
              backgroundColor: '#F2F2F7',
            }}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: '#FF9500',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFF' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
