import sys

inventory = []

def add_item(item_name, quantity, price):
    for item in inventory:
        if item['name'] == item_name:
            item['quantity'] += int(quantity)  # Potential type conversion error
            item['price'] = price  # Overwrites the price unconditionally
            print(f"Updated {item_name} quantity to {item['quantity']}")
            return
    # If item not found, add new item
    new_item = {'name': item_name, 'quantity': quantity, 'price': price}
    inventory.append(new_item)
    print(f"Added {item_name} to inventory")

def remove_item(item_name):
    global inventory
    inventory = [item for item in inventory if item['name'] != item_name]
    print(f"Removed {item_name} from inventory")

def list_inventory():
    print("Current Inventory:")
    for item in inventory:
        print(f"Name: {item['name']}, Quantity: {item['quantity']}, Price: {item['price']}")

def load_inventory():
    try:
        with open('inventory.txt', 'r') as file:
            for line in file:
                name, quantity, price = line.strip().split(',')
                add_item(name, int(quantity), float(price))  # Inconsistent data type handling
    except FileNotFoundError:
        print("Inventory file not found, starting with an empty inventory.")

def save_inventory():
    with open('inventory.txt', 'w') as file:
        for item in inventory:
            file.write(f"{item['name']},{item['quantity']},{item['price']}\n")

def main():
    load_inventory()
    while True:
        print("1. Add Item\n2. Remove Item\n3. List Inventory\n4. Exit")
        choice = input("Enter choice: ")
        if choice == '1':
            name = input("Enter item name: ")
            quantity = input("Enter quantity: ")
            price = input("Enter price: ")
            add_item(name, quantity, price)
        elif choice == '2':
            name = input("Enter item name to remove: ")
            remove_item(name)
        elif choice == '3':
            list_inventory()
        elif choice == '4':
            save_inventory()
            print("Exiting program.")
            break
        else:
            print("Invalid option, please try again.")

if __name__ == "__main__":
    main()
