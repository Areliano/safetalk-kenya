export interface BotResponse {
  message: string;
  suggestedActions?: string[];
}

export class ChatBot {
  private responses: Record<string, BotResponse[]> = {
    greeting: [
      {
        message: "Hello! I'm here to listen and support you. You're in a safe space where you can share anything that's troubling you. What would you like to talk about today?",
        suggestedActions: ["I'm being bullied", "I feel sad or anxious", "Someone hurt me", "I need someone to talk to"]
      }
    ],
    bullying: [
      {
        message: "I'm sorry you're experiencing bullying. That must be really difficult. Can you tell me more about what's happening? Remember, this is not your fault.",
        suggestedActions: ["It happens at school", "It's online/cyberbullying", "I don't know what to do", "I'm scared to tell anyone"]
      },
      {
        message: "Bullying is never okay, and you deserve to feel safe. Have you been able to tell a trusted adult like a teacher, parent, or counselor about this?",
        suggestedActions: ["Yes, but nothing changed", "No, I'm scared", "I don't know who to tell", "They won't believe me"]
      }
    ],
    mental_health: [
      {
        message: "Thank you for sharing that with me. It takes courage to talk about how you're feeling. Can you help me understand what's been making you feel this way?",
        suggestedActions: ["School stress", "Family problems", "Friend issues", "I don't know why"]
      },
      {
        message: "Your feelings are valid and important. When you feel sad or anxious, what helps you feel a little better, even if just for a moment?",
        suggestedActions: ["Talking to friends", "Listening to music", "Nothing helps", "I sleep a lot"]
      }
    ],
    abuse: [
      {
        message: "I want you to know that I believe you, and I'm glad you felt safe enough to share this with me. What happened to you is not okay, and it's not your fault.",
        suggestedActions: ["I need help now", "I'm scared", "I don't know what to do", "Can you help me?"]
      },
      {
        message: "Your safety is the most important thing. Do you feel safe where you are right now? If you're in immediate danger, please consider calling 999 or going to a trusted adult.",
        suggestedActions: ["I'm safe now", "I'm not sure", "I need help", "I want to report this"]
      }
    ],
    support: [
      {
        message: "I'm here to listen to whatever you need to share. Sometimes just talking about what's on your mind can help. What's been weighing on you lately?",
        suggestedActions: ["School problems", "Family issues", "Friend troubles", "I feel lonely"]
      }
    ],
    resources: [
      {
        message: "Here are some resources that might help you:\n\n🚨 Emergency: 999\n📞 Childline Kenya: 116 (Free 24/7)\n💻 Online counseling: www.childlinekenya.co.ke\n\nWould you like me to help you with anything else?",
        suggestedActions: ["Tell me more about Childline", "I need immediate help", "Other resources", "Continue talking"]
      }
    ],
    encouragement: [
      {
        message: "You're being really brave by reaching out and talking about this. That shows a lot of strength. Remember, you're not alone, and there are people who care about you.",
        suggestedActions: ["Thank you", "I don't feel strong", "What should I do next?", "Can we keep talking?"]
      }
    ]
  };

  private conversationContext: string[] = [];

  public getResponse(userMessage: string): BotResponse {
    const message = userMessage.toLowerCase();
    this.conversationContext.push(userMessage);

    // Analyze message content for appropriate response
    if (this.isGreeting(message)) {
      return this.getRandomResponse('greeting');
    }

    if (this.isBullyingRelated(message)) {
      return this.getRandomResponse('bullying');
    }

    if (this.isMentalHealthRelated(message)) {
      return this.getRandomResponse('mental_health');
    }

    if (this.isAbuseRelated(message)) {
      return this.getRandomResponse('abuse');
    }

    if (this.isResourceRequest(message)) {
      return this.getRandomResponse('resources');
    }

    // Default supportive response
    return this.getSupportiveResponse(userMessage);
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'hola', 'habari', 'mambo', 'salam'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isBullyingRelated(message: string): boolean {
    const keywords = ['bully', 'bullying', 'bullied', 'mean', 'hurt', 'tease', 'pick on', 'exclude'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isMentalHealthRelated(message: string): boolean {
    const keywords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'lonely', 'angry', 'confused', 'stressed'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isAbuseRelated(message: string): boolean {
    const keywords = ['abuse', 'touch', 'inappropriate', 'hurt', 'violence', 'unsafe', 'scared'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isResourceRequest(message: string): boolean {
    const keywords = ['help', 'resource', 'phone', 'call', 'contact', 'emergency', 'childline'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private getRandomResponse(category: string): BotResponse {
    const responses = this.responses[category];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  private getSupportiveResponse(userMessage: string): BotResponse {
    const supportiveResponses = [
      {
        message: "Thank you for sharing that with me. I hear you, and your feelings are important. Can you tell me more about what's going on?",
        suggestedActions: ["I want to explain more", "I need help", "I don't know what to say", "Can you give me advice?"]
      },
      {
        message: "It sounds like you're going through something difficult. I'm here to listen and support you. What would be most helpful for you right now?",
        suggestedActions: ["Someone to listen", "Practical advice", "Resources for help", "I need encouragement"]
      },
      {
        message: "I want you to know that reaching out shows real courage. Whatever you're dealing with, you don't have to face it alone. How can I best support you?",
        suggestedActions: ["Keep talking", "Get resources", "I need immediate help", "I feel better now"]
      }
    ];

    const randomIndex = Math.floor(Math.random() * supportiveResponses.length);
    return supportiveResponses[randomIndex];
  }

  public getInitialMessage(): BotResponse {
    return this.getRandomResponse('greeting');
  }
}