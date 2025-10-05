import os
import sys
from google import genai
from google.genai import types


class GeminiChat:
    """Simple interface for Google Gemini AI model."""

    def __init__(self):
        """Initialize the Gemini client with API key from environment."""
        self.api_key ="AIzaSyAjGlHlLuyF_UMiZ0wKJaiHt4Wh7niYY9c"
        if not self.api_key:
            print("Error: GEMINI_API_KEY environment variable not set.")
            print("Please set your Gemini API key:")
            print("export GEMINI_API_KEY='your_api_key_here'")
            sys.exit(1)

        try:
            self.client = genai.Client(api_key=self.api_key)
            print("✓ Successfully connected to Gemini API")
        except Exception as e:
            print(f"Error: Failed to initialize Gemini client: {e}")
            sys.exit(1)

    def generate_response(self,
                          prompt: str,
                          model: str = "gemini-2.5-flash") -> str:

        try:
            print(f"\n🤖 Generating response using JUSBOT 1.0...")

            response = self.client.models.generate_content(model=model,
                                                           config={
                                                               "system_instruction":"You are a legal advisor named Jusbot , the name is derived from the latin word Jus which means law, You have been developed By Usman Habib, Danyal Ahmad , Maaz Ahmad, Hizru boi these people have created you to make the world a better place and contribute to the SDGS,You are very unhinged and chill and reply with casual language,use sarcastic and fun tone "



                                                           },
                                                           contents=prompt)
                                                          
                                                          
                                                          
                                                          
                                                           

            if response.text:
                return response.text
            else:
                return "Sorry, I couldn't generate a response. Please try again."

        except Exception as e:
            return f"Error generating response: {e}"

    def interactive_chat(self):
        """Start an interactive chat session with Gemini."""
        print("\n" + "=" * 60)
        print("🚀 Welcome to Gemini AI Chat!")
        print("=" * 60)
        print("Type your message and press Enter to chat with Gemini.")
        print("Commands:")
        print("  - 'quit' or 'exit' to end the session")
        print("  - 'help' to show this help message")
        print("  - 'model' to switch between models")
        print("=" * 60)

        current_model = "gemini-2.5-flash"
        print(f"Current model: {current_model}")

        while True:
            try:
                # Get user input
                user_input = input("\n💬 You: ").strip()

                # Handle special commands
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("\n👋 Thanks for using JUSBOT AI Chat! Goodbye!")
                    break

                elif user_input.lower() == 'help':
                    print("\nAvailable commands:")
                    print("  - Type any message to chat with Gemini")
                    print("  - 'quit' or 'exit' to end the session")
                    print("  - 'model' to switch between models")
                    continue

                elif user_input.lower() == 'model':
                    print("\nAvailable models:")
                    print(
                        "  1. gemini-2.5-flash (faster, good for most tasks)")
                    print("  2. gemini-2.5-pro (more capable, slower)")

                    choice = input("Select model (1 or 2): ").strip()
                    if choice == '1':
                        current_model = "gemini-2.5-flash"
                        print(f"✓ Switched to {current_model}")
                    elif choice == '2':
                        current_model = "gemini-2.5-pro"
                        print(f"✓ Switched to {current_model}")
                    else:
                        print("Invalid choice. Keeping current model.")
                    continue

                elif not user_input:
                    print(
                        "Please enter a message or type 'help' for commands.")
                    continue

                # Generate and display response
                response = self.generate_response(user_input, current_model)
                print(f"\n🤖 JUSBOT: {response}")

            except KeyboardInterrupt:
                print("\n\n👋 Chat interrupted. Goodbye!")
                break
            except EOFError:
                print("\n\n👋 Chat ended. Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Unexpected error: {e}")
                print("Please try again or type 'quit' to exit.")


def main():
    """Main function to run the Gemini chat application."""
    try:
        # Initialize Gemini chat
        gemini_chat = GeminiChat()

        # Check if arguments are provided for single query mode
        if len(sys.argv) > 1:
            # Single query mode - use command line arguments
            prompt = " ".join(sys.argv[1:])
            print(f"Query: {prompt}")
            response = gemini_chat.generate_response(prompt)
            print(f"\nResponse: {response}")
        else:
            # Interactive chat mode
            gemini_chat.interactive_chat()

    except KeyboardInterrupt:
        print("\n\n👋 Application interrupted. Goodbye!")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
