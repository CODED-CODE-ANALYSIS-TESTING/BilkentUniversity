package com.example.coded.controller;

import com.example.coded.dto.CourseDTO;
import com.example.coded.dto.UserDTO;
import com.example.coded.exception.NotFoundException;
import com.example.coded.service.UserService;
import com.example.coded.model.User;
import com.example.coded.model.Instructor;
import com.example.coded.dto.InstructorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users= userService.listAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserDetails(id);
        return ResponseEntity.ok(userDTO);
    }
   /* @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") int id){
        try {
            User user = userService.findUserById(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
        }
    }*/
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user){

        User newUser =userService.addUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUpInstructor(@RequestBody InstructorDto instructorDto) {
        System.out.println("Received DTO: " + instructorDto); // Simple log to print the DTO
        System.out.println("Received DTO school id: " + instructorDto.getSchool_id()); // Simple log to print the DTO
        System.out.println("Received DTO uni id: " + instructorDto.getUniversity_id()); // Simple log to print the DTO
        System.out.println("Received DTO department: " + instructorDto.getDepartment()); // Simple log to print the DTO
        User instructor = userService.signUpInstructor(instructorDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(instructor);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user){
        try{
            User newUser =userService.updateUser(user);
            return new ResponseEntity<>(newUser, HttpStatus.OK);
        }
        catch(NotFoundException ex){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id){
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/instructors")
    public ResponseEntity<List<UserDTO>> getInstructors() {
        List<UserDTO> instructors = userService.getInstructors();
        return new ResponseEntity<>(instructors, HttpStatus.OK);
    }

    @GetMapping("/TAs")
    public ResponseEntity<List<UserDTO>> getTAs() {
        List<UserDTO> TAs = userService.getTAs();
        return new ResponseEntity<>( TAs, HttpStatus.OK);
    }


}