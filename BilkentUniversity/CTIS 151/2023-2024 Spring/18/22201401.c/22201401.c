#define _CRT_SECURE_NO_WARNINGS
#define ROW 100
#define COL 4
#include <stdio.h>


int readfromfile(FILE *file, int id[ROW], double points[ROW][COL]) {

	int i = 0;
	while (fscanf(file, "%d %lf %lf %lf %lf", &id[i], &points[i][0], &points[i][1], &points[i][2], &points[i][3]) != EOF)

		i++;


	return i;


}

void display(int id[ROW], double points[ROW][COL], int size) {
	double sum = 0, avg;
	char eligible;

	printf("ID	R   L   S   W   ELIGIBLE   OVERALL\n----------------------------------------------------------------\n");

	for (int i = 0; i < size; i++) {
		for (int j = 0; j < COL; j++) {
			sum += points[i][j];
		}
		avg = sum / 4;
		sum = 0;

		if (avg >= 6.5) {
			eligible = 'Y';
		}
		else
			eligible = 'N';
		printf("%5d %5.2f %5.2f %5.2f %5.2f %5c %7.2f\n", id[i], points[i][0], points[i][1], points[i][2], points[i][3], eligible, avg);
	}

}


int main(void) {

	FILE* file = fopen("ielts.txt", "r");

	if (file == NULL) {
		printf("could not open the file");
	}

	else {
		int id[ROW];
		double points[ROW][COL];
		int size = readfromfile(file, id, points);
		fclose(file);
		display(id, points, size);
	}


}