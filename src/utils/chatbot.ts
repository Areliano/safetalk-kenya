export interface BotResponse {
  message: string;
  suggestedActions?: string[];
}

export class ChatBot {
  private responses: Record<string, BotResponse[]> = {
    greeting: [
      {
        message: "Hello there! I'm so glad you've reached out today. This is a completely safe and anonymous space where you can share whatever is on your mind. I'm here to listen without judgment and help you process your thoughts and feelings. Take your time - what would you like to talk about?",
        suggestedActions: ["I'm being bullied or harassed", "I'm struggling with my emotions", "Someone has hurt me", "I just need someone to listen", "I'm having family problems"]
      }
    ],
    bullying: [
      {
        message: "I'm really sorry you're going through this. Bullying can feel overwhelming and isolating, but you've taken a brave step by talking about it. Every person deserves to feel safe and respected. Can you help me understand what's been happening? Even small details can help us figure out the best way forward.",
        suggestedActions: ["It's happening at school", "It's online harassment", "It's from people I thought were friends", "Physical bullying", "They're spreading rumors about me"]
      },
      {
        message: "That sounds incredibly difficult and exhausting to deal with. Bullying can really impact how we feel about ourselves and our daily life. Have you been able to talk to anyone you trust about this situation? Sometimes having an adult advocate can make a huge difference.",
        suggestedActions: ["I told someone but nothing changed", "I'm too scared to tell anyone", "I don't know who would believe me", "My parents don't understand", "I tried but it made things worse"]
      },
      {
        message: "It's completely understandable to feel scared or uncertain about who to turn to. Many young people face this exact dilemma. You deserve support, and there are people whose job it is to help in these situations. Would you like to explore some options for getting help, or would you prefer to talk more about how this is affecting you?",
        suggestedActions: ["Tell me about getting help", "I want to talk about how I'm feeling", "What if reporting makes it worse?", "I feel like it's my fault", "How do I protect myself?"]
      }
    ],
    mental_health: [
      {
        message: "Thank you for trusting me with something so personal. Mental health struggles are real and valid - you're not 'overreacting' or 'being dramatic.' Many people your age experience similar feelings, though everyone's situation is unique. Can you tell me more about what you've been experiencing lately?",
        suggestedActions: ["I feel sad most of the time", "I'm anxious about everything", "I can't concentrate on anything", "I feel angry and irritable", "I'm having trouble sleeping"]
      },
      {
        message: "Those feelings sound really heavy to carry. When you're dealing with these emotions, how do they show up in your daily life? Understanding the patterns can sometimes help us find ways to cope better.",
        suggestedActions: ["I avoid social situations", "My grades are suffering", "I don't enjoy things I used to", "I feel exhausted all the time", "I have panic attacks"]
      },
      {
        message: "It sounds like these feelings are really impacting your life in significant ways. That must be exhausting. Have you noticed if there are certain times, places, or situations where you feel a bit better or worse? Sometimes identifying these patterns can help us understand what might help.",
        suggestedActions: ["It's worse at school", "Weekends are harder", "I feel better when I'm alone", "It's worse when I'm with family", "Nothing really helps"]
      }
    ],
    abuse: [
      {
        message: "First, I want you to know that I believe you completely, and I'm so grateful you felt safe enough to share this with me. What you've experienced is absolutely not okay, and it is never, ever your fault. You are incredibly brave for speaking up. How are you feeling right now in this moment?",
        suggestedActions: ["I'm scared", "I feel confused", "I don't know if it counts as abuse", "I'm worried about getting someone in trouble", "I need help but don't know how"]
      },
      {
        message: "Your feelings, whatever they are, are completely valid. Abuse can be confusing because it often involves people we know or trust. Right now, your safety is the most important thing. Are you currently in a safe place where you can talk freely?",
        suggestedActions: ["Yes, I'm safe right now", "I'm not sure if I'm safe", "I'm worried about later", "I need to leave this situation", "I want to report what happened"]
      },
      {
        message: "I'm glad you're thinking about your safety. If you're in immediate danger, please don't hesitate to call 999 or reach out to a trusted adult right away. For non-emergency support, Childline Kenya (116) is available 24/7 and completely confidential. Would you like to talk about what steps might feel manageable for you right now?",
        suggestedActions: ["I want to make a report", "I need to talk to a counselor", "I'm not ready to report yet", "I want to tell a trusted adult", "I need safety planning help"]
      }
    ],
    school_stress: [
      {
        message: "School can feel overwhelming with all the different pressures - academic, social, and everything in between. It's really common to feel stressed about school, and it doesn't mean you're not capable. What specific part of school has been weighing on you the most?",
        suggestedActions: ["Academic pressure and grades", "Social situations and friendships", "Teacher relationships", "Bullying or harassment", "Future and career worries"]
      }
    ],
    family_issues: [
      {
        message: "Family relationships can be really complex, especially during your teenage years when you're growing and changing. Family stress can feel particularly difficult because home is supposed to be your safe space. What's been going on with your family that's troubling you?",
        suggestedActions: ["Parents are fighting a lot", "They don't understand me", "Financial stress at home", "Someone in my family is struggling", "I feel like the black sheep"]
      }
    ],
    loneliness: [
      {
        message: "Feeling lonely can be one of the most difficult experiences, especially when you're surrounded by people but still feel disconnected. Your feelings are completely valid - loneliness doesn't mean there's something wrong with you. Can you tell me more about when you feel most lonely?",
        suggestedActions: ["Even when I'm with friends", "At school during breaks", "At home with my family", "Social media makes it worse", "I don't fit in anywhere"]
      }
    ],
    support: [
      {
        message: "I'm honored that you've chosen to share with me. Sometimes just having someone listen can help us process our thoughts and feelings. There's no pressure to have everything figured out - we can take this one step at a time. What's been on your mind lately?",
        suggestedActions: ["I'm feeling overwhelmed", "I don't know who I am", "Everything feels too much", "I'm worried about my future", "I feel different from everyone else"]
      }
    ],
    resources: [
      {
        message: "Here are some resources that might help you:\n\n🚨 Emergency: 999 (if you're in immediate danger)\n📞 Childline Kenya: 116 (Free, confidential, 24/7)\n💻 Online support: www.childlinekenya.co.ke\n📱 Crisis Text Line: Text HOME to 741741\n🏥 Nearest hospital emergency room\n\nRemember, reaching out for help is a sign of strength, not weakness. Would you like more specific information about any of these resources?",
        suggestedActions: ["How does Childline work?", "I need immediate help", "I want online counseling", "Local support groups", "How to talk to a trusted adult"]
      }
    ],
    encouragement: [
      {
        message: "I want you to know that taking the time to talk about what you're going through shows incredible strength and self-awareness. Many people struggle in silence, but you've chosen to reach out. That takes real courage, even if it doesn't feel that way right now.",
        suggestedActions: ["I don't feel strong at all", "What should my next step be?", "How do I keep going?", "Can we keep talking?", "I feel a little better"]
      }
    ],
    coping_strategies: [
      {
        message: "Finding healthy ways to cope with difficult emotions is really important. What works for one person might not work for another, so it's about finding what feels right for you. Have you tried any strategies before, or would you like to explore some options together?",
        suggestedActions: ["Nothing has worked so far", "I want to try new strategies", "I used to have things that helped", "I don't have time for self-care", "I want quick relief"]
      }
    ]
  };

  private conversationContext: string[] = [];
  private currentTopic: string | null = null;
  private conversationDepth: number = 0;

  public getResponse(userMessage: string): BotResponse {
    const message = userMessage.toLowerCase();
    this.conversationContext.push(userMessage);
    this.conversationDepth++;

    // First, check for specific contextual responses based on conversation flow
    const contextualResponse = this.getContextualResponse(message);
    if (contextualResponse) {
      return contextualResponse;
    }

    // Analyze message content for appropriate response
    if (this.isGreeting(message)) {
      this.currentTopic = 'greeting';
      return this.getRandomResponse('greeting');
    }

    if (this.isBullyingRelated(message)) {
      this.currentTopic = 'bullying';
      return this.getProgressiveResponse('bullying');
    }

    if (this.isMentalHealthRelated(message)) {
      this.currentTopic = 'mental_health';
      return this.getProgressiveResponse('mental_health');
    }

    if (this.isAbuseRelated(message)) {
      this.currentTopic = 'abuse';
      return this.getProgressiveResponse('abuse');
    }

    if (this.isSchoolStressRelated(message)) {
      this.currentTopic = 'school_stress';
      return this.getRandomResponse('school_stress');
    }

    if (this.isFamilyRelated(message)) {
      this.currentTopic = 'family_issues';
      return this.getRandomResponse('family_issues');
    }

    if (this.isLonelinessRelated(message)) {
      this.currentTopic = 'loneliness';
      return this.getRandomResponse('loneliness');
    }

    if (this.isResourceRequest(message)) {
      return this.getRandomResponse('resources');
    }

    if (this.isCopingRequest(message)) {
      return this.getRandomResponse('coping_strategies');
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

  private isSchoolStressRelated(message: string): boolean {
    const keywords = ['school', 'grade', 'exam', 'test', 'homework', 'teacher', 'academic', 'pressure', 'study'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isFamilyRelated(message: string): boolean {
    const keywords = ['family', 'parent', 'mom', 'dad', 'mother', 'father', 'sibling', 'brother', 'sister', 'home'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isLonelinessRelated(message: string): boolean {
    const keywords = ['lonely', 'alone', 'isolated', 'no friends', 'don\'t fit', 'outcast', 'nobody understands'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isCopingRequest(message: string): boolean {
    const keywords = ['cope', 'coping', 'strategies', 'how to deal', 'what should i do', 'manage', 'handle'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private getContextualResponse(message: string): BotResponse | null {
    // Handle follow-up responses based on conversation context
    if (this.currentTopic && this.conversationDepth > 1) {
      const contextKeywords = this.getContextKeywords(message);
      
      if (contextKeywords.includes('better') || contextKeywords.includes('helped')) {
        return {
          message: "I'm really glad to hear that something is helping you feel better. It's important to recognize what works for you. Can you tell me more about what's been helpful? This might give us ideas for other strategies.",
          suggestedActions: ["It's talking to someone", "Being creative helps", "Physical activity", "Time in nature", "I'm not sure why it helps"]
        };
      }

      if (contextKeywords.includes('worse') || contextKeywords.includes('difficult')) {
        return {
          message: "I hear that things are feeling particularly difficult right now. That must be really hard to handle. When things feel overwhelming, sometimes it helps to focus on just the next small step. What feels like the most manageable thing you could do for yourself today?",
          suggestedActions: ["I can't do anything", "Maybe rest or sleep", "Talk to someone I trust", "Try a small self-care activity", "I don't know where to start"]
        };
      }

      if (contextKeywords.includes('scared') || contextKeywords.includes('afraid')) {
        return {
          message: "Fear is such a natural response when we're facing difficult situations. Your feelings are completely valid. Sometimes when we're scared, it can help to think about what specifically we're afraid of, so we can address those concerns one by one. What feels most scary to you right now?",
          suggestedActions: ["People won't believe me", "Things will get worse", "I'll get in trouble", "No one can help", "I don't know what will happen"]
        };
      }
    }

    return null;
  }

  private getContextKeywords(message: string): string[] {
    return message.toLowerCase().split(' ').filter(word => word.length > 2);
  }

  private getProgressiveResponse(category: string): BotResponse {
    const responses = this.responses[category];
    if (!responses) return this.getSupportiveResponse('');

    // Use conversation depth to progress through responses for deeper conversation
    const responseIndex = Math.min(this.conversationDepth - 1, responses.length - 1);
    return responses[responseIndex];
  }

  private getRandomResponse(category: string): BotResponse {
    const responses = this.responses[category];
    if (!responses) return this.getSupportiveResponse('');
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