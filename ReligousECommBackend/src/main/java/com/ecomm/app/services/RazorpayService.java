package com.ecomm.app.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.ecomm.app.exceptions.PaymentProcessingException; // Assuming you create this
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    private RazorpayClient getRazorpayClient() throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(keyId, keySecret);
        }
        return razorpayClient;
    }

    public Order createRazorpayOrder(Long amount, String currency, String receiptId) throws PaymentProcessingException {
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount); // amount in the smallest currency unit
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receiptId);
            orderRequest.put("payment_capture", 1); // Auto capture payment

            logger.info("Attempting to create Razorpay order for receiptId: {}", receiptId);
            Order order = getRazorpayClient().orders.create(orderRequest);
           
            return order;
        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay order for receiptId: {}. Reason: {}", receiptId, e.getMessage(), e);
            throw new PaymentProcessingException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws PaymentProcessingException {
        try {
            String body = razorpayOrderId + "|" + razorpayPaymentId;
            boolean isValid = Utils.verifySignature(body, razorpaySignature, keySecret);
            if (!isValid) {
                logger.warn("Invalid Razorpay signature for orderId: {}, paymentId: {}", razorpayOrderId, razorpayPaymentId);
            }
            return isValid;
        } catch (RazorpayException e) {
            logger.error("Error verifying Razorpay signature for orderId: {}, paymentId: {}. Reason: {}", razorpayOrderId, razorpayPaymentId, e.getMessage(), e);
            throw new PaymentProcessingException("Error during payment verification: " + e.getMessage(), e);
        }
    }
}