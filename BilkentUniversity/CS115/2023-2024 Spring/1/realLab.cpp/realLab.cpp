#define _CRT_SECURE_NO_WARNINGS

#include <string.h>

#include "LinkedList.h"

#define ARRSIZE 10

int hashcode(char string[])
{
	int i, len = strlen(string), sum = 0;

	for (i = 0; i < len; i++)
	{
		sum += string[i];
	}

	printf("The hash value is: %d", sum);

	return(sum%ARRSIZE);
}

void initArray(node_t *h[])
{
	for (int k = 0; k < ARRSIZE; k++)
		h[k] = NULL;
}

int menu()
{
	int num;
	printf("\nMENU\n*************************************\n1. Insert a supply into the Hash Table\n");
	printf("2. Remove a supply from the Hash Table\n3. Display a Hash Table\n4. Exit\nPlease enter your choice :");
	scanf("%d", &num);
	return(num);
}

node_t* search(node_t* h, LType item)
{
	while (h != NULL && (strcmp(item.username, h->data.username) != 0))
		h = h->next;

	return(h);
}

void insert(node_t* h[ARRSIZE], LType item)
{
	int hash = hashcode(item.username);

	if (h[hash] == NULL)
		h[hash] = addBeginning(h[hash], item);
	else
	{
		node_t* addp = search(h[hash], item);

		if (addp != NULL)
		{
			//strcpy(addp->data.username, item.username);
			strcpy(addp->data.password, item.password);
		}
		else
		{
			node_t* tp = h[hash];

			while (tp->next != NULL)
				tp = tp->next;

			addAfter(tp, item);
		}
	}
}
/*
void removeItem(node_t* h[ARRSIZE], char username[SIZE])
{
	int hash = hashcode(username);

	if (h[hash]->next == NULL)
		deleteFirst(h[hash], username);
	else
	{


	}

}
*/
void display(node_t* h[ARRSIZE])
{
	for (int i = 0; i < SIZE; i++)
	{
		if (h[i] != NULL)
			printf("No elements over here");

		while (h[i] != NULL)
		{
			printf("%s %s\n", h[i]->data.username, h[i]->data.password);
			h[i] = h[i]->next;
		}
		printf("\n");
	}
}

int main(void)
{
	int k;

	node_t* h[ARRSIZE];
	initArray(h);

	do
	{
		k = menu();

		switch (k)
		{
		case 1:
		{
			user_t item;

			printf("Enter the username: ");
			scanf(" %s", item.username);

			printf("\nEnter the password: ");
			scanf(" %s", item.password);

			insert(h, item);

			break;
		}

		case 2:
		{
			char str[SIZE];
			printf("Enter the username to delete: ", str);
			scanf(" %s", str);

			//removeItem(h, str);

			break;
		}

		case 3:
		{
			display(h);
			break;
		}

		default:
			break;
		}

	} while (k != 4);

	return(0);
}