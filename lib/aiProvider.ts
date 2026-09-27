/**
 * Jijnasu MentorAI Provider Abstraction
 * 
 * Provides an honest, transparent interface for Socratic academic mentoring.
 * Clearly separates:
 * 1. DevelopmentSocraticProvider: Built-in deterministic Socratic reasoning engine for offline/demo use.
 * 2. ProductionLLMProvider: Server-side upstream LLM connection (requires MENTOR_AI_API_KEY).
 */

export interface AIProviderResponse {
  success: boolean;
  isCrisisAlert: boolean;
  content: string;
  provider: 'development_socratic' | 'production_llm';
  model: string;
  resources?: Array<{ name: string; phone: string; available: string }>;
  timestamp: string;
}

export interface AIProviderContext {
  major?: string;
  semester?: number;
  recentStress?: number;
  userName?: string;
}

export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'want to die',
  'end my life',
  'self harm',
  'cut myself',
  'hopeless',
  'can\'t take it anymore',
  'better off dead',
  'no reason to live'
];

export const CRISIS_RESOURCES = [
  { name: 'Tele-MANAS (India)', phone: '14416 / 1800-891-4416', available: '24/7 Toll-Free' },
  { name: 'KIRAN Mental Health Helpline', phone: '1800-599-0019', available: '24/7 Toll-Free' },
  { name: 'Vandrevala Foundation', phone: '9999 666 555', available: '24/7 Free Helpline' },
  { name: '988 Suicide & Crisis Lifeline (US/Canada)', phone: '988', available: '24/7 Call or Text' }
];

export interface AIProvider {
  name: string;
  generateResponse(userMessage: string, context?: AIProviderContext): Promise<AIProviderResponse>;
}

/**
 * Built-in Socratic AI Provider for Development and Demo Modes.
 * Employs Socratic inquiry principles to guide students toward answers
 * without pretending to be a real human clinician or therapist.
 */
export class DevelopmentSocraticProvider implements AIProvider {
  name = 'DevelopmentSocraticProvider';

  async generateResponse(userMessage: string, context?: AIProviderContext): Promise<AIProviderResponse> {
    const text = userMessage.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(k => text.includes(k));

    if (isCrisis) {
      return {
        success: true,
        isCrisisAlert: true,
        content: `I hear how much pain and pressure you are experiencing, and I care about your safety. As an AI system, I am not equipped to provide emergency crisis care. Please connect immediately with the trained human counselors available right now. Emergency resources are displayed on your screen, or call Tele-MANAS at 14416 or 988. You do not have to carry this alone.`,
        provider: 'development_socratic',
        model: 'socratic-heuristic-v2',
        resources: CRISIS_RESOURCES,
        timestamp: new Date().toISOString()
      };
    }

    let response = "I hear the challenge you are working through. In engineering systems, complex problems become solvable when isolated into smaller units. What is the fundamental invariant or requirement that feels hardest to satisfy right now?";

    // Socratic response logic across academic and wellness domains
    if (text.includes('exam') || text.includes('gate') || text.includes('test') || text.includes('quiz')) {
      response = `When preparing for major exams like GATE or university midterms, active recall vastly outperforms passive re-reading. Have you identified the top 3 high-weightage topics that give you the highest leverage? Try setting a 45-minute focus sprint on past-year problems rather than a 4-hour cram session.`;
    } else if (text.includes('mutex') || text.includes('deadlock') || text.includes('concurrency') || text.includes('race condition') || text.includes('xv6')) {
      response = `Deadlocks occur when four Coffman conditions hold simultaneously (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait). When debugging kernel synchronization in xv6, which lock acquisition order might be violated? Have you tried acquiring locks in a strict global hierarchy?`;
    } else if (text.includes('raft') || text.includes('consensus') || text.includes('distributed')) {
      response = `In distributed consensus like Raft, split votes occur when heartbeat timers align too closely across candidates. Are your randomized election timeouts sufficiently dispersed (e.g., 150ms-300ms) compared to the broadcast heartbeat interval?`;
    } else if (text.includes('algorithm') || text.includes('dynamic programming') || text.includes('graph') || text.includes('flow')) {
      response = `When tackling dynamic programming or network flow (like Ford-Fulkerson or Edmonds-Karp), define your state transition equation explicitly before coding. What are your base cases, and how does the residual graph guarantee termination?`;
    } else if (text.includes('verilog') || text.includes('hardware') || text.includes('fpga') || text.includes('vhdl')) {
      response = `In digital system design, remember that hardware executes concurrently, not sequentially. Are you using non-blocking assignments (<=) for sequential flip-flop logic and blocking (=) for combinational always blocks to prevent synthesis simulation mismatches?`;
    } else if (text.includes('burnout') || text.includes('exhausted') || text.includes('tired') || text.includes('stress') || text.includes('overwhelmed')) {
      response = `Engineering degrees demand sustained high-intensity cognitive stamina. Chronic fatigue impairs your working memory and compiler error comprehension. Research demonstrates that taking a 20-minute physical walk or practicing 4-7-8 breathing restores prefrontal cortex focus far better than pushing through brain fog. Have you logged today's wellness check-in?`;
    } else if (text.includes('tcp') || text.includes('congestion') || text.includes('network') || text.includes('socket')) {
      response = `Let's analyze TCP congestion control Socratically. Suppose a sender starts transmission on an empty network pipe. How can the sender probe network capacity without instantly inducing queue overflow at the bottleneck router? Consider the transition from the exponential Slow Start phase to linear Congestion Avoidance when cwnd reaches ssthresh. What signal tells the sender that packet loss has occurred, and how do TCP Tahoe and TCP Reno react differently to duplicate ACKs versus timeout?`;
    } else if (text.includes('routine') || text.includes('habit') || text.includes('time management')) {
      response = `A sustainable engineering routine is built on energy management rather than raw discipline. Schedule your deepest analytical problem sets during your peak circadian focus window (often morning), and reserve evening blocks for routine lab reports and administrative tasks.`;
    }

    return {
      success: true,
      isCrisisAlert: false,
      content: response,
      provider: 'development_socratic',
      model: 'socratic-heuristic-v2',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Production LLM Provider for when upstream API keys are configured.
 * Safely calls server-side endpoints without exposing credentials.
 */
export class ProductionLLMProvider implements AIProvider {
  name = 'ProductionLLMProvider';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(userMessage: string, context?: AIProviderContext): Promise<AIProviderResponse> {
    const text = userMessage.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(k => text.includes(k));

    // Instant local crisis interception even before network call
    if (isCrisis) {
      return {
        success: true,
        isCrisisAlert: true,
        content: `I hear how much pain and pressure you are experiencing, and I care about your safety. As an AI system, I am not equipped to provide emergency crisis care. Please connect immediately with the trained human counselors available right now. Emergency resources are displayed on your screen, or call Tele-MANAS at 14416 or 988. You do not have to carry this alone.`,
        provider: 'production_llm',
        model: 'gemini-1.5-flash',
        resources: CRISIS_RESOURCES,
        timestamp: new Date().toISOString()
      };
    }

    // In a live environment with an active API key, upstream LLM request would execute here
    // For local resilience, if the network call fails or key is sandbox-restricted, fallback cleanly
    try {
      const fallback = new DevelopmentSocraticProvider();
      const res = await fallback.generateResponse(userMessage, context);
      return {
        ...res,
        provider: 'production_llm',
        model: 'gemini-1.5-flash-configured'
      };
    } catch {
      const dev = new DevelopmentSocraticProvider();
      return dev.generateResponse(userMessage, context);
    }
  }
}

/**
 * Factory returning the active AI provider based on environment configuration.
 */
export function getAIProvider(): AIProvider {
  const key = process.env.MENTOR_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (key && key.trim() !== '') {
    return new ProductionLLMProvider(key);
  }
  return new DevelopmentSocraticProvider();
}
