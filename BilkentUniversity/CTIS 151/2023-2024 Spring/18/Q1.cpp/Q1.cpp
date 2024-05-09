#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

#define MAX_STUDENTS 100

int readFromFile(FILE *file, int ids[], double points[][4]) {
	int count = 0;
	while (fscanf(file, "%d %lf %lf %lf %lf", &ids[count], &points[count][0], &points[count][1], &points[count][2], &points[count][3]) == 5) {
		count++;
	}
	return count;
}

void display(int ids[], double points[][4], int numStudents) {
	printf("ID\tR\tL\tS\tW\tELIGIBLE\tOVERALL\n");
	printf("---------------------------------------------------------\n");
	for (int i = 0; i < numStudents; i++) {
		double average = (points[i][0] + points[i][1] + points[i][2] + points[i][3]) / 4.0;
		char eligible = (average >= 6.5) ? 'Y' : 'N'; 
		printf("%d\t%.2lf\t%.2lf\t%.2lf\t%.2lf\t%c\t\t%.2lf\n", ids[i], points[i][0], points[i][1], points[i][2], points[i][3], eligible, average);
	}
}

int main() {
	FILE *file = fopen("ielts.txt", "r");
	if (file == NULL) {
		printf("Error opening file.\n");
		return -1;
	}

	int ids[MAX_STUDENTS];
	double points[MAX_STUDENTS][4];
	int numStudents = readFromFile(file, ids, points);

	display(ids, points, numStudents);

	fclose(file);
	return 0;
}
