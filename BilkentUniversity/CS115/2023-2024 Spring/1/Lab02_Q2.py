# Lab02_Q2.py

def main():
    x_start = int(input("Enter starting value of x: "))
    step_size = int(input("Enter step size: "))
    x_end = int(input("Enter ending value of x: "))
    
    print("x", "y", sep="\t")
    print("----------------------------------")
    
    for x in range(x_start, x_end + 1, step_size):
        y = x**2 + 7*x - 5
        print(x, y, sep="\t")

if __name__ == "__main__":
    main()

