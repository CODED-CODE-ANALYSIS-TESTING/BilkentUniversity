#define _CRT_SECURE_NO_WARNINGS_
#include <stdio.h>
#define ROW 5
#define COLUMN 4


void displayMenu ()


  void  readFromFile(FILE *file, int id[ROW], double points[ROW][COLUMN]) {

	while (fscanf(file, "%d %f %f %f %f", &id[numStudents], &points[numStudents][0], &points[numStudents][1], &points[numStudents][2], &points[numStudents][3]) == 5) {
		numStudents++;
	}
	return numStudents;




}

void display(int id[], double points[][4], int numStudents) {
	char eligible;
	printf("ID\tR\tL\tS\tW\tELIGIBLE\tOVERALL\n");
	printf("---------------------------------------------------\n");
	for (int i = 0; i < numStudents; i++) {
		double avg = (points[i][0] + points[i][1] + points[i][2] + points[i][3]) / 4;
		if (avg > 6.5)
			eligible = "Y";
		else 
			eligible = "N";

		printf("%d\t%.2f\t%.2f\t%.2f\t%.2f\t%c\t\t%.2f\n", id[i], points[i][0], points[i][1], points[i][2], points[i][3], eligible, avg);
	}



 int main(void) {




	 int one Dim[100];
	 double twoDim[100][4]; 
	 int numStudents = readFromFile(file, id, points);
	 display(id, points, numStudents);

	 fclose(file);
	 return 0;
	

	file = fopen("ielts.txt", "r");

	if (file == NULL)
		printf("File can not be opened. !"); 

	else {




	}
	return(0);
}