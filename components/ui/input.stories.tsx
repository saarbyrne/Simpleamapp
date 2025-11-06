import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchIcon, MailIcon, LockIcon, UserIcon, InfoIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { Input } from './input';

/**
 * Input - World-Class Text Input Component
 *
 * A flexible, feature-rich text input with extensive customization options.
 *
 * ## Features
 * - **Size Variants**: sm, md, lg
 * - **Validation States**: error, success, warning
 * - **Icon Support**: Left and right icons
 * - **Loading State**: Show spinner while processing
 * - **Clearable**: Add clear button for easy reset
 * - **Character Counter**: Show character count with maxLength
 * - **Full Token Integration**: All styling from design system
 * - **WCAG 2.1 AA Compliant**: Full keyboard support and screen readers
 *
 * ## Usage
 * ```tsx
 * // Basic
 * <Input placeholder="Enter text" />
 *
 * // With validation
 * <Input variant="error" placeholder="Email" />
 *
 * // With icons
 * <Input
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * // Clearable with counter
 * <Input
 *   clearable
 *   maxLength={100}
 *   showCharacterCount
 *   placeholder="Bio"
 * />
 * ```
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'SimpleAM',
    placeholder: 'Team name',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only value',
  },
};

// ============================================================================
// Size Variants
// ============================================================================

function SizeVariantsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Small</label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Medium (default)</label>
        <Input size="md" placeholder="Medium input" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Large</label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  );
}

export const SizeVariants: Story = {
  render: () => <SizeVariantsDemo />,
};

// ============================================================================
// Validation States
// ============================================================================

function ValidationStatesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Default</label>
        <Input variant="default" placeholder="Normal state" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Error</label>
        <Input variant="error" placeholder="Invalid email" />
        <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Success</label>
        <Input variant="success" value="valid@email.com" />
        <p className="text-sm text-green-500 mt-1">Email is valid</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Warning</label>
        <Input variant="warning" value="test@test.com" />
        <p className="text-sm text-yellow-600 mt-1">This looks like a test email</p>
      </div>
    </div>
  );
}

export const ValidationStates: Story = {
  render: () => <ValidationStatesDemo />,
};

// ============================================================================
// Icon Examples
// ============================================================================

function LeftIconDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input leftIcon={<SearchIcon size={16} />} placeholder="Search..." />
      <Input leftIcon={<MailIcon size={16} />} type="email" placeholder="Email" />
      <Input leftIcon={<LockIcon size={16} />} type="password" placeholder="Password" />
      <Input leftIcon={<UserIcon size={16} />} placeholder="Username" />
    </div>
  );
}

export const LeftIcon: Story = {
  render: () => <LeftIconDemo />,
};

function RightIconDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input rightIcon={<InfoIcon size={16} />} placeholder="Hover for info" />
      <Input
        variant="error"
        rightIcon={<AlertCircleIcon size={16} />}
        placeholder="Invalid"
      />
      <Input
        variant="success"
        rightIcon={<CheckCircleIcon size={16} />}
        value="Valid"
      />
    </div>
  );
}

export const RightIcon: Story = {
  render: () => <RightIconDemo />,
};

function BothIconsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input
        leftIcon={<SearchIcon size={16} />}
        rightIcon={<InfoIcon size={16} />}
        placeholder="Search with info"
      />
      <Input
        size="lg"
        leftIcon={<MailIcon size={20} />}
        rightIcon={<CheckCircleIcon size={20} />}
        variant="success"
        value="valid@email.com"
      />
    </div>
  );
}

export const BothIcons: Story = {
  render: () => <BothIconsDemo />,
};

// ============================================================================
// Loading State
// ============================================================================

function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setLoading(true);
    // Simulate async validation
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Type to trigger loading</label>
        <Input
          value={value}
          onChange={handleChange}
          loading={loading}
          leftIcon={<UserIcon size={16} />}
          placeholder="Check username availability"
        />
        {loading && <p className="text-sm text-gray-500 mt-1">Checking availability...</p>}
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Loading with different sizes</label>
        <div className="space-y-2">
          <Input size="sm" loading placeholder="Small loading" />
          <Input size="md" loading placeholder="Medium loading" />
          <Input size="lg" loading placeholder="Large loading" />
        </div>
      </div>
    </div>
  );
}

export const Loading: Story = {
  render: () => <LoadingDemo />,
};

// ============================================================================
// Clearable
// ============================================================================

function ClearableDemo() {
  const [value1, setValue1] = useState('Clear me!');
  const [value2, setValue2] = useState('');

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Controlled Clearable</label>
        <Input
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          onClear={() => setValue1('')}
          clearable
          placeholder="Type something"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">With Search Icon</label>
        <Input
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          onClear={() => setValue2('')}
          clearable
          leftIcon={<SearchIcon size={16} />}
          placeholder="Search..."
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Different Sizes</label>
        <div className="space-y-2">
          <Input size="sm" clearable defaultValue="Small clearable" />
          <Input size="md" clearable defaultValue="Medium clearable" />
          <Input size="lg" clearable defaultValue="Large clearable" />
        </div>
      </div>
    </div>
  );
}

export const Clearable: Story = {
  render: () => <ClearableDemo />,
};

// ============================================================================
// Character Counter
// ============================================================================

function CharacterCounterDemo() {
  const [bio, setBio] = useState('');
  const [tweet, setTweet] = useState('');

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Bio (max 100 characters)</label>
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={100}
          showCharacterCount
          placeholder="Tell us about yourself"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Tweet (max 280 characters)</label>
        <Input
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          maxLength={280}
          showCharacterCount
          clearable
          onClear={() => setTweet('')}
          placeholder="What's happening?"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">With Warning (90% of limit)</label>
        <Input
          defaultValue="This is almost at the character limit and will turn yellow soon when you keep typing more characters"
          maxLength={100}
          showCharacterCount
          placeholder="Type near the limit"
        />
      </div>
    </div>
  );
}

export const CharacterCounter: Story = {
  render: () => <CharacterCounterDemo />,
};

// ============================================================================
// Input Types
// ============================================================================

function InputTypesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" leftIcon={<MailIcon size={16} />} />
      <Input type="password" placeholder="Password" leftIcon={<LockIcon size={16} />} />
      <Input type="search" placeholder="Search" leftIcon={<SearchIcon size={16} />} />
      <Input type="tel" placeholder="Phone" />
      <Input type="url" placeholder="Website URL" />
      <Input type="number" placeholder="Age" />
      <Input type="date" />
      <Input type="time" />
    </div>
  );
}

export const InputTypes: Story = {
  render: () => <InputTypesDemo />,
};

// ============================================================================
// Real-World Examples
// ============================================================================

function SearchInputDemo() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Input
        size="lg"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onClear={() => setQuery('')}
        leftIcon={<SearchIcon size={20} />}
        loading={loading}
        clearable
        placeholder="Search players, teams, or matches..."
      />
    </div>
  );
}

export const SearchInput: Story = {
  render: () => <SearchInputDemo />,
};

function EmailValidationDemo() {
  const [email, setEmail] = useState('');
  const [variant, setVariant] = useState<'default' | 'error' | 'success'>('default');
  const [message, setMessage] = useState('');

  const validateEmail = (value: string) => {
    setEmail(value);

    if (!value) {
      setVariant('default');
      setMessage('');
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (isValid) {
      setVariant('success');
      setMessage('Email is valid');
    } else {
      setVariant('error');
      setMessage('Please enter a valid email address');
    }
  };

  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium mb-2 block">Email Address</label>
      <Input
        type="email"
        value={email}
        onChange={(e) => validateEmail(e.target.value)}
        onClear={() => validateEmail('')}
        variant={variant}
        leftIcon={<MailIcon size={16} />}
        rightIcon={
          variant === 'success' ? <CheckCircleIcon size={16} /> :
          variant === 'error' ? <AlertCircleIcon size={16} /> :
          undefined
        }
        clearable
        placeholder="your@email.com"
      />
      {message && (
        <p className={`text-sm mt-1 ${
          variant === 'success' ? 'text-green-500' : 'text-red-500'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export const EmailValidation: Story = {
  render: () => <EmailValidationDemo />,
};

function PasswordInputDemo() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const calculateStrength = (value: string) => {
    setPassword(value);

    if (!value) {
      setStrength('weak');
      return;
    }

    const hasLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*]/.test(value);
    const hasUpper = /[A-Z]/.test(value);

    const score = [hasLength, hasNumber, hasSpecial, hasUpper].filter(Boolean).length;

    if (score >= 3) setStrength('strong');
    else if (score >= 2) setStrength('medium');
    else setStrength('weak');
  };

  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium mb-2 block">Password</label>
      <Input
        type="password"
        value={password}
        onChange={(e) => calculateStrength(e.target.value)}
        onClear={() => calculateStrength('')}
        variant={
          strength === 'strong' ? 'success' :
          strength === 'medium' ? 'warning' :
          password ? 'error' : 'default'
        }
        leftIcon={<LockIcon size={16} />}
        clearable
        placeholder="Enter password"
      />
      {password && (
        <div className="mt-2">
          <div className="flex gap-1">
            <div className={`h-1 flex-1 rounded ${
              strength === 'weak' ? 'bg-red-500' : 'bg-gray-200'
            }`} />
            <div className={`h-1 flex-1 rounded ${
              strength === 'medium' || strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'
            }`} />
            <div className={`h-1 flex-1 rounded ${
              strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          </div>
          <p className={`text-sm mt-1 ${
            strength === 'strong' ? 'text-green-500' :
            strength === 'medium' ? 'text-yellow-600' :
            'text-red-500'
          }`}>
            Password strength: {strength}
          </p>
        </div>
      )}
    </div>
  );
}

export const PasswordInput: Story = {
  render: () => <PasswordInputDemo />,
};

// ============================================================================
// All Features Combined
// ============================================================================

function AllFeaturesDemo() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium mb-2 block">
        All Features Combined
      </label>
      <Input
        size="lg"
        variant={value.length > 50 ? 'warning' : 'default'}
        value={value}
        onChange={handleChange}
        onClear={() => setValue('')}
        leftIcon={<SearchIcon size={20} />}
        loading={loading}
        clearable
        maxLength={100}
        showCharacterCount
        placeholder="Type to see all features in action"
      />
      <p className="text-sm text-gray-500 mt-2">
        This input combines: size variant, validation state, icons, loading, clear button, and character counter.
      </p>
    </div>
  );
}

export const AllFeatures: Story = {
  render: () => <AllFeaturesDemo />,
};
