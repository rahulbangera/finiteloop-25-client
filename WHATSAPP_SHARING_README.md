# WhatsApp Profile Sharing Feature

This feature allows users to share profile information via WhatsApp with rich formatting and emojis.

## 🚀 How to Enable/Disable

### Method 1: Configuration File
Edit `src/config/whatsappConfig.ts`:

```typescript
export const WHATSAPP_SHARING_SETTINGS = {
  enabled: true, // Set to false to disable globally
  // ... other settings
};
```

### Method 2: Quick Functions
```typescript
import { enableWhatsAppSharing, disableWhatsAppSharing } from '@/config/whatsappConfig';

// Enable sharing
enableWhatsAppSharing();

// Disable sharing
disableWhatsAppSharing();
```

### Method 3: Component Level
In your component:
```typescript
const { handleWhatsAppShare } = useWhatsAppShare({
  // ... other props
  enabled: false, // Disable for this specific instance
});
```

## ⚙️ Configuration Options

### Content Settings
```typescript
content: {
  includeEmojis: true,        // Show emojis in the message
  includeStats: true,         // Include activity points and attendance  
  includeBio: true,           // Include user bio if available
  includeLinks: true,         // Include social media links
}
```

### Custom Messages
```typescript
messages: {
  communityInvitation: "Join our amazing student community and connect with talented peers!",
  opportunitiesText: "Discover opportunities, events, and much more!",
}
```

## 📱 Message Format

When enabled, the WhatsApp message includes:

- **Header**: Profile name with decorative formatting
- **Personal Details**: USN, Branch, Graduation Year, Role
- **About Section**: User bio (if available)
- **Performance Stats**: Activity points and attendance
- **Social Links**: Instagram, LinkedIn, GitHub, Portfolio, LeetCode
- **Profile Link**: Direct link to full profile
- **Community Invitation**: Customizable call-to-action

## 🎨 WhatsApp Formatting Features

The message uses WhatsApp's built-in formatting:
- `*text*` - **Bold text**
- `_text_` - _Italic text_
- `> text` - Quoted text
- `• text` - Bullet points
- Emojis for visual enhancement

## 🔧 Technical Details

### Files Structure
```
src/
├── components/profile/
│   ├── Profile.tsx          # Main profile component
│   └── WhatsAppShare.tsx    # Standalone WhatsApp sharing component
└── config/
    └── whatsappConfig.ts    # Configuration settings
```

### Key Components

#### `useWhatsAppShare` Hook
```typescript
const { handleWhatsAppShare } = useWhatsAppShare({
  user: currentUser,
  isViewingOtherProfile: boolean,
  userId: string,
  onShareComplete: () => void,
  enabled: boolean,
});
```

#### `WhatsAppShare` Component
Handles all WhatsApp sharing logic including:
- Message formatting with proper emoji encoding
- URL encoding for WhatsApp Web API
- Error handling and user feedback
- Conditional content inclusion based on settings

## 🐛 Troubleshooting

### Emojis Not Displaying
- Check that `includeEmojis: true` in config
- Ensure proper UTF-8 encoding in files
- Verify browser emoji support

### Sharing Not Working
- Confirm `enabled: true` in configuration
- Check browser console for errors
- Verify WhatsApp Web API access

### Message Formatting Issues
- Test different devices (mobile/desktop)
- Check WhatsApp version compatibility
- Verify URL encoding is working correctly

## 📝 Example Usage

```typescript
// In your component
import { useWhatsAppShare, WHATSAPP_SHARE_CONFIG } from './WhatsAppShare';

const MyComponent = () => {
  const { handleWhatsAppShare } = useWhatsAppShare({
    user: userData,
    isViewingOtherProfile: false,
    userId: "123",
    onShareComplete: () => console.log("Share completed!"),
    enabled: WHATSAPP_SHARE_CONFIG.enabled,
  });

  return (
    <button onClick={handleWhatsAppShare}>
      Share on WhatsApp
    </button>
  );
};
```

## 🔒 Privacy & Security

- No personal data is stored during sharing
- All sharing happens client-side
- URLs are properly encoded and validated
- Users can control what information to include

---

**Quick Toggle**: To quickly enable/disable the entire feature, just change `enabled: false` in `whatsappConfig.ts`!
