#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 50
#define MAX_NAME_LEN 50

struct Student {
    int id;
    char name[MAX_NAME_LEN];
    float gpa;
};

struct Student students[MAX_STUDENTS];
int num_students = 0;

void addStudent(int id, char *name, float gpa) {
    if (num_students >= MAX_STUDENTS) {
        printf("Database full\n");
        return;
    }
    struct Student new_student;
    new_student.id = id;
    strcpy(new_student.name, name); // Potential buffer overflow if name is too long
    new_student.gpa = gpa;
    students[num_students++] = new_student; // No validation for duplicate IDs
}

void printStudents() {
    for (int i = 0; i < num_students; i++) {
        printf("ID: %d, Name: %s, GPA: %.2f\n", students[i].id, students[i].name, students[i].gpa);
    }
}

void saveStudents() {
    FILE *file = fopen("students.dat", "w");
    if (file == NULL) {
        printf("Failed to open file\n");
        return;
    }
    for (int i = 0; i < num_students; i++) {
        fprintf(file, "%d %s %f\n", students[i].id, students[i].name, students[i].gpa);
    }
    fclose(file);
}

void loadStudents() {
    FILE *file = fopen("students.dat", "r");
    if (file == NULL) {
        printf("Failed to open file\n");
        return;
    }
    struct Student temp;
    while (fscanf(file, "%d %49s %f", &temp.id, temp.name, &temp.gpa) == 3) {
        if (num_students < MAX_STUDENTS) {
            students[num_students++] = temp;
        }
    }
    fclose(file);
}

int main() {
    int choice, id;
    char name[MAX_NAME_LEN];
    float gpa;

    while (1) {
        printf("1. Add Student\n2. Print Students\n3. Save to File\n4. Load from File\n5. Exit\nEnter your choice: ");
        scanf("%d", &choice);
        switch (choice) {
            case 1:
                printf("Enter ID: ");
                scanf("%d", &id);
                printf("Enter Name: ");
                scanf("%s", name); // No protection against buffer overflow
                printf("Enter GPA: ");
                scanf("%f", &gpa);
                addStudent(id, name, gpa);
                break;
            case 2:
                printStudents();
                break;
            case 3:
                saveStudents();
                break;
            case 4:
                loadStudents();
                break;
            case 5:
                return 0;
            default:
                printf("Invalid choice\n");
        }
    }

    return 0;
}
