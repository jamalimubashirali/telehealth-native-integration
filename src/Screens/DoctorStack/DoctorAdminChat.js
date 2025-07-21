import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import doctorApi from '../../services/doctorApi';

const DoctorAdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch messages from backend
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.getDoctorAdminChat();
      // negotiation history is an array of { sender, message, timestamp }
      const history = res.data?.data?.earningNegotiationHistory || [];
      // Map to chat format
      setMessages(history.map((msg, idx) => ({
        id: msg.timestamp ? msg.timestamp : idx.toString(),
        sender: msg.sender,
        text: msg.message,
        timestamp: msg.timestamp,
      })));
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      setSending(true);
      try {
        await doctorApi.postDoctorAdminMessage(input);
        setInput('');
        await fetchMessages(); // Refetch after sending
      } catch (err) {
        // Optionally show error
      } finally {
        setSending(false);
      }
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.message,
        item.sender === 'doctor' ? styles.doctor : styles.admin,
      ]}>
      <Text style={styles.text}>{item.text}</Text>
      {item.timestamp && (
        <Text style={{fontSize: 10, color: '#888', marginTop: 2}}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with Admin</Text>
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Loading messages...</Text></View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            padding: 16,
          }}
          refreshing={loading}
          onRefresh={fetchMessages}
        />
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          editable={!sending}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn} disabled={sending || !input.trim()}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  message: {marginVertical: 6, maxWidth: '70%', padding: 10, borderRadius: 12},
  doctor: {alignSelf: 'flex-end', backgroundColor: '#0e61f3'},
  admin: {alignSelf: 'flex-start', backgroundColor: '#f0f0f0'},
  text: {color: '#222', fontSize: 15},
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#0e61f3',
    borderRadius: 25,
    padding: 10,
  },
});

export default DoctorAdminChat;
