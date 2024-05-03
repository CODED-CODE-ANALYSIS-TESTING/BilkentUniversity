package com.example.coded.controller;
import com.example.coded.dto.UniversityDTO;
import com.example.coded.exception.NotFoundException;
import com.example.coded.model.Department;
import com.example.coded.service.UniversityService;
import com.example.coded.model.University;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/university")
public class UniversityController {
    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }
  /*  @GetMapping
    public ResponseEntity<List<University>> getAllUniversities(){
        System.out.println("came to get all unis");
        List<University> universities= universityService.listAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }*/

    @GetMapping
    public List<UniversityDTO> getAllUniversities() {
        return universityService.getAllUniversities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable("id") int id){
        try {
            University university = universityService.findUniversityById(id);
            return new ResponseEntity<>(university, HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{universityId}/departments")
    public ResponseEntity<?> getDepartmentsByUniversity(@PathVariable Long universityId) {
        System.out.println("inside the get mapping in the university");
        List<Department> departments = universityService.findDepartmentsByUniversityId(universityId);
        if (departments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Departments found: " + departments);
        return ResponseEntity.ok(departments);
    }

    @PostMapping
    public ResponseEntity<University> addUniversity(@RequestBody University university){

        University newUniversity =universityService.addUniversity(university);
        return new ResponseEntity<>(newUniversity, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<University> updateUniversity(@RequestBody University university){
        try{
            University newUniversity =universityService.updateUniversity(university);
            return new ResponseEntity<>(newUniversity, HttpStatus.OK);
        }
        catch(NotFoundException ex){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUniversity(@PathVariable("id") int id){
        try {
            universityService.deleteUniversity(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}