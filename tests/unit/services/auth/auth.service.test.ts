/**
 * Unit Tests: AuthService
 *
 * Tests authentication logic including:
 * - User registration with password hashing
 * - Login with password validation
 * - JWT token generation
 * - Google OAuth validation
 * - Token validation
 *
 * @jest-environment node
 */
// Mock bcrypt using manual mock in __mocks__ folder
jest.mock('bcrypt');

import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { hash as mockBcryptHash, compare as mockBcryptCompare } from 'bcrypt';

// Types for mocks
interface MockUser {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  googleId?: string;
  passwordHash?: string | null;
  firestoreId?: string;
  userId?: string;
}

interface MockUsersService {
  findByEmail: jest.Mock<Promise<MockUser | null>, [string]>;
  findByGoogleId: jest.Mock<Promise<MockUser | null>, [string]>;
  findById: jest.Mock<Promise<MockUser | null>, [number]>;
  findByEmailWithPassword: jest.Mock<Promise<MockUser | null>, [string]>;
  createUser: jest.Mock<Promise<MockUser>, [Partial<MockUser>]>;
}

interface MockJwtService {
  sign: jest.Mock<string, [object]>;
}

// Test fixtures
const testUser: MockUser = {
  id: 1,
  email: 'test@expenses.local',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.png',
};

const testUserWithPassword: MockUser = {
  ...testUser,
  passwordHash: 'hashed_password_123',
};

const googleProfile = {
  id: 'google-id-123',
  emails: [{ value: 'google@example.com' }],
  displayName: 'Google User',
  photos: [{ value: 'https://example.com/google-avatar.png' }],
};

// AuthService type - using interface to avoid importing the actual class
interface IAuthService {
  register(
    email: string,
    password: string,
    name?: string,
  ): Promise<{ access_token: string; user: MockUser }>;
  loginWithPassword(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: MockUser }>;
  login(user: MockUser): Promise<{ access_token: string; user: MockUser }>;
  validateToken(payload: { sub: number; userId: string }): Promise<MockUser | null>;
  validateGoogleUser(profile: GoogleProfile): Promise<MockUser>;
}

interface GoogleProfile {
  id: string;
  emails: { value: string }[];
  displayName: string;
  photos: { value: string }[];
}

// Cast to jest.Mock for type safety
const mockedBcryptHash = mockBcryptHash as jest.Mock;
const mockedBcryptCompare = mockBcryptCompare as jest.Mock;

describe('AuthService', () => {
  let authService: IAuthService;
  let mockUsersService: MockUsersService;
  let mockJwtService: MockJwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Reset bcrypt mock implementations
    mockedBcryptHash.mockResolvedValue('hashed_password_123');
    mockedBcryptCompare.mockResolvedValue(true);

    // Create mock services
    mockUsersService = {
      findByEmail: jest.fn(),
      findByGoogleId: jest.fn(),
      findById: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      createUser: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token_123'),
    };

    // Now import AuthService - it will use the mocked bcrypt
    const { AuthService } = await import(
      '../../../../app/services/auth-service/src/auth/auth.service'
    );
    // @ts-expect-error - using mock services
    authService = new AuthService(mockUsersService, mockJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // register()
  // ===========================================================================
  describe('register', () => {
    it('should create a new user with hashed password and return login response', async () => {
      // Arrange
      const email = 'new@expenses.local';
      const password = 'SecurePass123!';
      const name = 'New User';
      const createdUser: MockUser = { id: 2, email, name };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(createdUser);

      // Act
      const result = await authService.register(email, password, name);

      // Assert
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcryptHash).toHaveBeenCalledWith(password, 10);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        email,
        name,
        passwordHash: 'hashed_password_123',
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token', 'mock_jwt_token_123');
      expect(result.user).toMatchObject({ id: 2, email, name });
    });

    it('should use email prefix as default name when name not provided', async () => {
      // Arrange
      const email = 'defaultname@expenses.local';
      const password = 'SecurePass123!';
      const createdUser: MockUser = { id: 3, email, name: 'defaultname' };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(createdUser);

      // Act
      await authService.register(email, password);

      // Assert
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        email,
        name: 'defaultname',
        passwordHash: 'hashed_password_123',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const email = 'existing@expenses.local';
      const password = 'SecurePass123!';

      mockUsersService.findByEmail.mockResolvedValue(testUser);

      // Act & Assert
      await expect(authService.register(email, password)).rejects.toThrow(ConflictException);
      await expect(authService.register(email, password)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // loginWithPassword()
  // ===========================================================================
  describe('loginWithPassword', () => {
    it('should return login response for valid credentials', async () => {
      // Arrange
      const email = 'test@expenses.local';
      const password = 'CorrectPassword123!';

      mockUsersService.findByEmailWithPassword.mockResolvedValue({ ...testUserWithPassword });
      mockedBcryptCompare.mockResolvedValue(true);

      // Act
      const result = await authService.loginWithPassword(email, password);

      // Assert
      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
      expect(mockedBcryptCompare).toHaveBeenCalledWith(password, 'hashed_password_123');
      expect(result).toHaveProperty('access_token', 'mock_jwt_token_123');
      expect(result.user).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const email = 'nonexistent@expenses.local';
      const password = 'AnyPassword123!';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.loginWithPassword(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.loginWithPassword(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when user has no password hash', async () => {
      // Arrange
      const email = 'google-only@expenses.local';
      const password = 'AnyPassword123!';
      const googleOnlyUser: MockUser = { id: 4, email, name: 'Google Only', passwordHash: null };

      mockUsersService.findByEmailWithPassword.mockResolvedValue(googleOnlyUser);

      // Act & Assert
      await expect(authService.loginWithPassword(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const email = 'test@expenses.local';
      const password = 'WrongPassword123!';

      mockUsersService.findByEmailWithPassword.mockResolvedValue({ ...testUserWithPassword });
      mockedBcryptCompare.mockResolvedValue(false);

      // Act & Assert
      await expect(authService.loginWithPassword(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.loginWithPassword(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should remove passwordHash from returned user object', async () => {
      // Arrange
      const email = 'test@expenses.local';
      const password = 'CorrectPassword123!';

      mockUsersService.findByEmailWithPassword.mockResolvedValue({ ...testUserWithPassword });
      mockedBcryptCompare.mockResolvedValue(true);

      // Act
      const result = await authService.loginWithPassword(email, password);

      // Assert
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });

  // ===========================================================================
  // login()
  // ===========================================================================
  describe('login', () => {
    it('should generate JWT with correct payload structure', async () => {
      // Arrange
      const user: MockUser = { ...testUser };

      // Act
      const result = await authService.login(user);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        name: user.name,
        userId: String(user.id),
      });
      expect(result.access_token).toBe('mock_jwt_token_123');
    });

    it('should include firestoreId in payload when available', async () => {
      // Arrange
      const userWithFirestore: MockUser = { ...testUser, firestoreId: 'firestore-doc-id-123' };

      // Act
      await authService.login(userWithFirestore);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'firestore-doc-id-123',
        }),
      );
    });

    it('should return user object with all expected fields', async () => {
      // Arrange
      const user: MockUser = { ...testUser };

      // Act
      const result = await authService.login(user);

      // Assert
      expect(result.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        firestoreId: String(user.id),
      });
    });

    it('should use firestoreId for user.firestoreId when available', async () => {
      // Arrange
      const userWithFirestore: MockUser = { ...testUser, firestoreId: 'firestore-doc-id-456' };

      // Act
      const result = await authService.login(userWithFirestore);

      // Assert
      expect(result.user.firestoreId).toBe('firestore-doc-id-456');
    });
  });

  // ===========================================================================
  // validateToken()
  // ===========================================================================
  describe('validateToken', () => {
    it('should return user with attached userId and firestoreId from payload', async () => {
      // Arrange
      const payload = { sub: 1, userId: 'firestore-id-789' };
      mockUsersService.findById.mockResolvedValue({ ...testUser });

      // Act
      const result = await authService.validateToken(payload);

      // Assert
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
      expect(result.userId).toBe('firestore-id-789');
      expect(result.firestoreId).toBe('firestore-id-789');
    });

    it('should return null when user not found', async () => {
      // Arrange
      const payload = { sub: 999, userId: 'nonexistent-id' };
      mockUsersService.findById.mockResolvedValue(null);

      // Act
      const result = await authService.validateToken(payload);

      // Assert
      expect(result).toBeNull();
    });

    it('should not modify result when user is null', async () => {
      // Arrange
      const payload = { sub: 999, userId: 'some-id' };
      mockUsersService.findById.mockResolvedValue(null);

      // Act
      const result = await authService.validateToken(payload);

      // Assert
      expect(result).toBeNull();
      // No error should be thrown when trying to attach properties to null
    });
  });

  // ===========================================================================
  // validateGoogleUser()
  // ===========================================================================
  describe('validateGoogleUser', () => {
    it('should return existing user when found by googleId', async () => {
      // Arrange
      const existingGoogleUser: MockUser = {
        id: 5,
        email: 'google@example.com',
        name: 'Google User',
        googleId: 'google-id-123',
      };
      mockUsersService.findByGoogleId.mockResolvedValue(existingGoogleUser);

      // Act
      const result = await authService.validateGoogleUser(googleProfile);

      // Assert
      expect(mockUsersService.findByGoogleId).toHaveBeenCalledWith('google-id-123');
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
      expect(result).toEqual(existingGoogleUser);
    });

    it('should create new user when not found by googleId', async () => {
      // Arrange
      const newGoogleUser: MockUser = {
        id: 6,
        email: 'google@example.com',
        name: 'Google User',
        googleId: 'google-id-123',
        avatarUrl: 'https://example.com/google-avatar.png',
      };
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(newGoogleUser);

      // Act
      const result = await authService.validateGoogleUser(googleProfile);

      // Assert
      expect(mockUsersService.findByGoogleId).toHaveBeenCalledWith('google-id-123');
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        googleId: 'google-id-123',
        email: 'google@example.com',
        name: 'Google User',
        avatarUrl: 'https://example.com/google-avatar.png',
      });
      expect(result).toEqual(newGoogleUser);
    });

    it('should handle missing photo in Google profile', async () => {
      // Arrange
      const profileWithoutPhoto = {
        id: 'google-id-456',
        emails: [{ value: 'nophoto@example.com' }],
        displayName: 'No Photo User',
        photos: [],
      };
      const newUser: MockUser = {
        id: 7,
        email: 'nophoto@example.com',
        name: 'No Photo User',
        googleId: 'google-id-456',
      };
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(newUser);

      // Act
      const result = await authService.validateGoogleUser(profileWithoutPhoto);

      // Assert
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        googleId: 'google-id-456',
        email: 'nophoto@example.com',
        name: 'No Photo User',
        avatarUrl: undefined,
      });
      expect(result).toEqual(newUser);
    });
  });
});
