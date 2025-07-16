package com.ecomm.app.dtos;
public class OrderResponse {
    private boolean success;
    private String orderId;
    private Long amount;
    private String currency;
    private String message;

    public OrderResponse(boolean success, String orderId, Long amount, String currency, String message) {
        this.success = success;
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.message = message;
    }

    public OrderResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}