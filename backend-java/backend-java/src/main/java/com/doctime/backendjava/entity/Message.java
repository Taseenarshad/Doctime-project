package com.doctime.backendjava.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("sender_id")
    private Long senderId;

    @JsonProperty("sender_role")
    private String senderRole;

    @JsonProperty("receiver_id")
    private Long receiverId;

    @JsonProperty("receiver_role")
    private String receiverRole;

    private String content;

    @JsonProperty("created_at")
    private String createdAt;
}