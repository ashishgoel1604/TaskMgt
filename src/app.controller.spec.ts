import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { of } from 'rxjs';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(() => 'Hello World!'), // Mocking the getHello method
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return "Hello World!" from the service', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });

  it('should call getHello method of AppService', () => {
    controller.getHello();
    expect(appService.getHello).toHaveBeenCalled();
  });
});
