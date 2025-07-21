package com.ecomm.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecomm.app.enums.ERole;
import com.ecomm.app.models.Role;
import com.ecomm.app.repo.RoleRepository;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
	
	
	@Autowired
	RoleRepository repository;
	@RequestMapping("/{role}")
	public ResponseEntity<?> addRoles(@PathVariable String role){
		try {
			Role urole=new Role();
			if(role.equalsIgnoreCase("admin")) {
				urole.setName(ERole.ROLE_ADMIN);
				repository.save(urole);
			}else {
				urole.setName(ERole.ROLE_USER);
				
				repository.save(urole);
			}
			
			return new ResponseEntity(urole,HttpStatus.CREATED);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

			return new ResponseEntity(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	
	

}
