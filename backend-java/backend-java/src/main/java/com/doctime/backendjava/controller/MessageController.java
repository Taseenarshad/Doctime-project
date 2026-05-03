package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.SendMessageRequest;
import com.doctime.backendjava.entity.Message;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.MessageRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(
            MessageRepository messageRepository,
            UserRepository userRepository
    ) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getMessagesForUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }

        List<Message> messages = messageRepository.findBySenderIdOrReceiverId(userId, userId);
        messages.sort(Comparator.comparing(Message::getId));

        Map<Long, Map<String, Object>> participants = new HashMap<>();

        for (Message message : messages) {
            addParticipant(participants, message.getSenderId());
            addParticipant(participants, message.getReceiverId());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("messages", messages);
        response.put("participants", participants);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/contacts/{userId}")
    public ResponseEntity<?> getAvailableContacts(@PathVariable Long userId) {
        Optional<User> currentUserOptional = userRepository.findById(userId);

        if (currentUserOptional.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }

        User currentUser = currentUserOptional.get();
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> contacts = new ArrayList<>();

        for (User user : allUsers) {
            if (user.getId().equals(currentUser.getId())) continue;

            boolean include = false;

            if ("admin".equals(currentUser.getRole())) {
                include = true;
            } else if ("patient".equals(currentUser.getRole()) && "doctor".equals(user.getRole())) {
                include = true;
            } else if ("doctor".equals(currentUser.getRole()) && "patient".equals(user.getRole())) {
                include = true;
            }

            if (include) {
                Map<String, Object> contact = new HashMap<>();
                contact.put("id", user.getId());
                contact.put("name", user.getName());
                contact.put("role", user.getRole());
                contacts.add(contact);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("contacts", contacts);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        if (request.getSender_id() == null ||
                request.getReceiver_id() == null ||
                request.getSender_role() == null ||
                request.getReceiver_role() == null ||
                request.getContent() == null ||
                request.getContent().isBlank()) {

            Map<String, Object> response = new HashMap<>();
            response.put("message", "All fields are required");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> senderOptional = userRepository.findById(request.getSender_id());
        Optional<User> receiverOptional = userRepository.findById(request.getReceiver_id());

        if (senderOptional.isEmpty() || receiverOptional.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Sender or receiver not found");
            return ResponseEntity.status(404).body(response);
        }

        Message message = new Message();
        message.setSenderId(request.getSender_id());
        message.setSenderRole(request.getSender_role());
        message.setReceiverId(request.getReceiver_id());
        message.setReceiverRole(request.getReceiver_role());
        message.setContent(request.getContent());
        message.setCreatedAt(LocalDateTime.now().toString());

        messageRepository.save(message);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Message sent successfully");
        return ResponseEntity.ok(response);
    }

    private void addParticipant(Map<Long, Map<String, Object>> participants, Long userId) {
        if (participants.containsKey(userId)) return;

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            Map<String, Object> participant = new HashMap<>();
            participant.put("id", user.getId());
            participant.put("name", user.getName());
            participant.put("role", user.getRole());

            participants.put(userId, participant);
        }
    }
}