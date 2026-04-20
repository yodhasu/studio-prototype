import os
from dotenv import load_dotenv

def check_env():
    """
    Diagnostic script to verify the environment setup.
    """
    print("--- 3-Layer Architecture Environment Check ---")
    
    # Load .env file
    if os.path.exists(".env"):
        load_dotenv()
        print("[v] .env file found and loaded.")
    else:
        print("[x] .env file NOT found. Please create one.")
        return

    # Check key variables
    project_id = os.getenv("PROJECT_ID")
    if project_id:
        print(f"[v] PROJECT_ID: {project_id}")
    else:
        print("[x] PROJECT_ID not found in .env")

    # Check directories
    required_dirs = ["directives", "execution", ".tmp"]
    for d in required_dirs:
        if os.path.isdir(d):
            print(f"[v] Directory '{d}' exists.")
        else:
            print(f"[x] Directory '{d}' is MISSING.")

    print("--- Check Complete ---")

if __name__ == "__main__":
    check_env()
