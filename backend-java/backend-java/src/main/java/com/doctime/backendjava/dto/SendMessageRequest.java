package com.doctime.backendjava.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long sender_id;
    private String sender_role;
    private Long receiver_id;
    private String receiver_role;
    private String content;
}