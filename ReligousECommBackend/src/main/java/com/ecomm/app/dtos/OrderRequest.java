package com.ecomm.app.dtos;





import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class OrderRequest {
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1 (paise)")
    private Long amount; // In smallest currency unit (e.g., paise)
    private String currency = "INR";
    private String receiptId;

    // Getters and Setters
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

    public String getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(String receiptId) {
        this.receiptId = receiptId;
    }
}