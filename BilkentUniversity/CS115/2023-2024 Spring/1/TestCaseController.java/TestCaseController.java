package com.example.coded.controller;

import com.example.coded.dto.LabPartDTO;
import com.example.coded.dto.TestCaseDTO;
import com.example.coded.exception.NotFoundException;
import com.example.coded.model.LabPart;
import com.example.coded.model.TestCase;
import com.example.coded.repository.LabPartRepository;
import com.example.coded.service.LabPartService;
import com.example.coded.service.TestCaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/test_case")
public class TestCaseController {
    private final TestCaseService test_caseService;
    private final LabPartRepository labPartRepository;
    private final LabPartService labPartService;

    public TestCaseController(TestCaseService test_caseService, LabPartRepository labPartRepository, LabPartService labPartService) {
        this.test_caseService = test_caseService;
        this.labPartRepository = labPartRepository;
        this.labPartService = labPartService;
    }

    @GetMapping
    public ResponseEntity<List<TestCaseDTO>> getAllTestCases() {
        List<TestCase> test_cases = test_caseService.listAllTestCases();
        List<TestCaseDTO> testCaseDTOS = new ArrayList<>();

        if (!test_cases.isEmpty()) {
            for (TestCase tc : test_cases) {
                testCaseDTOS.add(TestCaseDTO.fromEntity(tc));
            }

        }
        return new ResponseEntity<>(testCaseDTOS, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestCaseDTO> getTestCaseById(@PathVariable("id") Long id) {
        try {
            TestCase test_case = test_caseService.findTestCaseById(id);
            return new ResponseEntity<>(TestCaseDTO.fromEntity(test_case), HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/labParts")
    public ResponseEntity<List<TestCaseDTO>> getTestCasesForLabAssignment(@RequestParam("labPartIds") List<Long> labPartIds) {
        try {
            List<TestCase> testCases = test_caseService.findTestCasesByLabPartIds(labPartIds);
            List<TestCaseDTO> testCaseDTOS = new ArrayList<>();

            if (!testCases.isEmpty()) {
                for (TestCase tc : testCases) {
                    testCaseDTOS.add(TestCaseDTO.fromEntity(tc));
                }
            }

            return new ResponseEntity<>(testCaseDTOS, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<TestCaseDTO> addTestCase(@RequestBody TestCase test_case, Long labPartId) {

        LabPart labPart = labPartService.findLabPartById( labPartId);

        test_case.setLabPart(labPart);

        TestCase newTestCase = test_caseService.addTestCase(test_case);

        TestCaseDTO testCaseDTO = TestCaseDTO.fromEntity(newTestCase);
        return new ResponseEntity<>(testCaseDTO, HttpStatus.CREATED);
    }


    @PutMapping
    public ResponseEntity<TestCaseDTO> updateTestCase(@RequestBody TestCase test_case) {
        try {
            TestCase newTestCase = test_caseService.updateTestCase(test_case);
            TestCaseDTO testCaseDTO = TestCaseDTO.fromEntity(newTestCase);
            return new ResponseEntity<>(testCaseDTO, HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTestCase(@PathVariable("id") Long id) {
        try {
            test_caseService.deleteTestCase(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}