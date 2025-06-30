const { characterInfo, characterCostumeChange } = require('../controllers/character'); // Replace with the actual path to your module file
const { getContentList, getContentInfo, getContentByCategory } = require('../controllers/content');

const Result = require('../utils/result');
const serviceCharacter = require('../service/character');
const serviceContent = require('../service/content');

//CHARACTER TEST
jest.mock('../utils/result', () => ({
  success: jest.fn((ctx, data, message) => ({ data, message })),
  error: jest.fn((ctx, code, message) => ({ code, message })),
}));

jest.mock('../service/character', () => ({
  getCharacterInfo: jest.fn((player_id) => ({
    character_id: 1,
    player_id,
    gender: 1,
    face: 2,
    skin: 3,
    hair: 4,
    haircolor: 5,
    top: 6,
    bottom: 7,
    shoes: 8,
    acc: 9,
  })),
  costumeChange: jest.fn((player_id, face, skin, hair, haircolor, top, bottom, shoes, acc) => ({
    player_id,
    gender: 2,
    face,
    skin,
    hair,
    haircolor,
    top,
    bottom,
    shoes,
    acc,
  })),
}));

describe('characterInfo', () => {
  it('should return character information', async () => {
    const ctx = { request: { body: { player_id: '12345' } } };
    const expectedCharacter = {
      character_id: 1,
      player_id: '12345',
      gender: 1,
      face: 2,
      skin: 3,
      hair: 4,
      haircolor: 5,
      top: 6,
      bottom: 7,
      shoes: 8,
      acc: 9,
    };

    await characterInfo(ctx);

    expect(serviceCharacter.getCharacterInfo).toHaveBeenCalledWith('12345');
    expect(Result.success).toHaveBeenCalledWith(ctx, { character: expectedCharacter }, '캐릭터 정보가 성공적으로 가져왔습니다.');
  });

  it('should handle missing player_id', async () => {
    const ctx = { request: { body: {} } };
    const errorMessage = '패러미터가 비어 있습니다.';

    await characterInfo(ctx);

    expect(Result.error).toHaveBeenCalledWith(ctx, 1002, errorMessage);
  });

  it('should handle errors', async () => {
    const ctx = { request: { body: { player_id: '12345' } } };
    const errorMessage = 'Error occurred.';
    serviceCharacter.getCharacterInfo.mockRejectedValueOnce({ code: 'ERROR_CODE', message: errorMessage });

    await characterInfo(ctx);

    expect(Result.error).toHaveBeenCalledWith(ctx, 'ERROR_CODE', errorMessage);
  });
});

describe('characterCostumeChange', () => {
  it('should change character costume successfully', async () => {
    const ctx = { request: { body: { player_id: '12345', face: 2, skin: 3, hair: 4, haircolor: 5, top: 6, bottom: 7, shoes: 8, acc: 9 } } };
    const expectedCharacter = {
      player_id: '12345',
      gender: 2,
      face: 2,
      skin: 3,
      hair: 4,
      haircolor: 5,
      top: 6,
      bottom: 7,
      shoes: 8,
      acc: 9,
    };

    await characterCostumeChange(ctx);

    expect(serviceCharacter.costumeChange).toHaveBeenCalledWith('12345', 2, 3, 4, 5, 6, 7, 8, 9);
    expect(Result.success).toHaveBeenCalledWith(ctx, { character: expectedCharacter }, '코스튬을 성공적으로 변경되었습니다.');
  });

  it('should handle missing player_id', async () => {
    const ctx = { request: { body: { face: 2, skin: 3, hair: 4, haircolor: 5, top: 6, bottom: 7, shoes: 8, acc: 9 } } };
    const errorMessage = '패러미터가 비어 있습니다.';

    await characterCostumeChange(ctx);

    expect(Result.error).toHaveBeenCalledWith(ctx, 1002, errorMessage);
  });

  it('should handle errors', async () => {
    const ctx = { request: { body: { player_id: '12345', face: 2, skin: 3, hair: 4, haircolor: 5, top: 6, bottom: 7, shoes: 8, acc: 9 } } };
    const errorMessage = 'Error occurred.';
    serviceCharacter.costumeChange.mockRejectedValueOnce({ code: 'ERROR_CODE', message: errorMessage });

    await characterCostumeChange(ctx);

    expect(Result.error).toHaveBeenCalledWith(ctx, 'ERROR_CODE', errorMessage);
  });
});
