package com.ecomm.app.exceptions;

//package com.ecomm.app.exceptions;
public class PaymentProcessingException extends RuntimeException {
 public PaymentProcessingException(String message) {
     super(message);
 }
 public PaymentProcessingException(String message, Throwable cause) {
     super(message, cause);
 }
}