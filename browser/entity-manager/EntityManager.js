var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { QueryRunnerProviderAlreadyReleasedError } from "../error/QueryRunnerProviderAlreadyReleasedError";
import { NoNeedToReleaseEntityManagerError } from "../error/NoNeedToReleaseEntityManagerError";
import { TreeRepository } from "../repository/TreeRepository";
import { Repository } from "../repository/Repository";
import { FindOptionsUtils } from "../find-options/FindOptionsUtils";
import { SubjectBuilder } from "../persistence/SubjectBuilder";
import { SubjectOperationExecutor } from "../persistence/SubjectOperationExecutor";
import { PlainObjectToNewEntityTransformer } from "../query-builder/transformer/PlainObjectToNewEntityTransformer";
import { PlainObjectToDatabaseEntityTransformer } from "../query-builder/transformer/PlainObjectToDatabaseEntityTransformer";
import { CustomRepositoryNotFoundError } from "../error/CustomRepositoryNotFoundError";
import { getMetadataArgsStorage } from "../index";
import { AbstractRepository } from "../repository/AbstractRepository";
import { CustomRepositoryCannotInheritRepositoryError } from "../error/CustomRepositoryCannotInheritRepositoryError";
import { MongoDriver } from "../driver/mongodb/MongoDriver";
import { RepositoryNotFoundError } from "../error/RepositoryNotFoundError";
import { RepositoryNotTreeError } from "../error/RepositoryNotTreeError";
import { RepositoryFactory } from "../repository/RepositoryFactory";
import { EntityManagerFactory } from "./EntityManagerFactory";
import { TreeRepositoryNotSupportedError } from "../error/TreeRepositoryNotSupportedError";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
var EntityManager = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function EntityManager(connection, queryRunner) {
        // -------------------------------------------------------------------------
        // Protected Properties
        // -------------------------------------------------------------------------
        /**
         * Once created and then reused by en repositories.
         */
        this.repositories = [];
        this.connection = connection;
        if (queryRunner) {
            this.queryRunner = queryRunner;
            // dynamic: this.queryRunner = manager;
            Object.assign(this.queryRunner, { manager: this });
        }
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided entity manager.
     */
    EntityManager.prototype.transaction = function (runInTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var usedQueryRunner, transactionEntityManager, result, err_1, rollbackError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.connection.driver instanceof MongoDriver)
                            throw new Error("Transactions aren't supported by MongoDB.");
                        if (this.queryRunner && this.queryRunner.isReleased)
                            throw new QueryRunnerProviderAlreadyReleasedError();
                        if (this.queryRunner && this.queryRunner.isTransactionActive)
                            throw new Error("Cannot start transaction because its already started");
                        usedQueryRunner = this.queryRunner || this.connection.createQueryRunner("master");
                        transactionEntityManager = new EntityManagerFactory().create(this.connection, usedQueryRunner);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 10, 13]);
                        return [4 /*yield*/, usedQueryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, runInTransaction(transactionEntityManager)];
                    case 3:
                        result = _a.sent();
                        return [4 /*yield*/, usedQueryRunner.commitTransaction()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, result];
                    case 5:
                        err_1 = _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, usedQueryRunner.rollbackTransaction()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        rollbackError_1 = _a.sent();
                        return [3 /*break*/, 9];
                    case 9: throw err_1;
                    case 10:
                        if (!!this.queryRunner) return [3 /*break*/, 12];
                        return [4 /*yield*/, usedQueryRunner.release()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes raw SQL query and returns raw database results.
     */
    EntityManager.prototype.query = function (query, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.connection.query(query, parameters, this.queryRunner)];
            });
        });
    };
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    EntityManager.prototype.createQueryBuilder = function (entityClass, alias, queryRunner) {
        if (alias) {
            return this.connection.createQueryBuilder(entityClass, alias, queryRunner || this.queryRunner);
        }
        else {
            return this.connection.createQueryBuilder(entityClass || this.queryRunner);
        }
    };
    /**
     * Checks if entity has an id by its Function type or schema name.
     */
    EntityManager.prototype.hasId = function (targetOrEntity, maybeEntity) {
        var target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var metadata = this.connection.getMetadata(target);
        return metadata.hasId(entity);
    };
    /**
     * Gets entity mixed id.
     */
    EntityManager.prototype.getId = function (targetOrEntity, maybeEntity) {
        var target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var metadata = this.connection.getMetadata(target);
        return metadata.getEntityIdMixedMap(entity);
    };
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    EntityManager.prototype.create = function (entityClass, plainObjectOrObjects) {
        var _this = this;
        var metadata = this.connection.getMetadata(entityClass);
        if (!plainObjectOrObjects)
            return metadata.create();
        if (plainObjectOrObjects instanceof Array)
            return plainObjectOrObjects.map(function (plainEntityLike) { return _this.create(entityClass, plainEntityLike); });
        return this.merge(entityClass, metadata.create(), plainObjectOrObjects);
    };
    /**
     * Merges two entities into one new entity.
     */
    EntityManager.prototype.merge = function (entityClass, mergeIntoEntity) {
        var entityLikes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            entityLikes[_i - 2] = arguments[_i];
        }
        var metadata = this.connection.getMetadata(entityClass);
        var plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer();
        entityLikes.forEach(function (object) { return plainObjectToEntityTransformer.transform(mergeIntoEntity, object, metadata); });
        return mergeIntoEntity;
    };
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    EntityManager.prototype.preload = function (entityClass, entityLike) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, plainObjectToDatabaseEntityTransformer, transformedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(entityClass);
                        plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer(this.connection.manager);
                        return [4 /*yield*/, plainObjectToDatabaseEntityTransformer.transform(entityLike, metadata)];
                    case 1:
                        transformedEntity = _a.sent();
                        if (transformedEntity)
                            return [2 /*return*/, this.merge(entityClass, transformedEntity, entityLike)];
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * Saves a given entity in the database.
     */
    EntityManager.prototype.save = function (targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        var _this = this;
        var target = (arguments.length > 1 && (targetOrEntity instanceof Function || typeof targetOrEntity === "string")) ? targetOrEntity : undefined;
        var entity = target ? maybeEntityOrOptions : targetOrEntity;
        var options = target ? maybeOptions : maybeEntityOrOptions;
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, transactionEntityManager, executors_1, finalTarget, metadata, databaseEntityLoader, executor, executorsNeedsToBeExecuted, isTransactionStartedByItself, error_1, rollbackError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
                        transactionEntityManager = new EntityManagerFactory().create(this.connection, queryRunner);
                        if (options && options.data)
                            Object.assign(queryRunner.data, options.data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 18, 21]);
                        executors_1 = [];
                        if (!(entity instanceof Array)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(entity.map(function (entity) { return __awaiter(_this, void 0, void 0, function () {
                                var entityTarget, metadata, databaseEntityLoader, executor;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            entityTarget = target ? target : entity.constructor;
                                            metadata = this.connection.getMetadata(entityTarget);
                                            databaseEntityLoader = new SubjectBuilder(this.connection, queryRunner);
                                            return [4 /*yield*/, databaseEntityLoader.persist(entity, metadata)];
                                        case 1:
                                            _a.sent();
                                            executor = new SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunner, databaseEntityLoader.operateSubjects);
                                            executors_1.push(executor);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        finalTarget = target ? target : entity.constructor;
                        metadata = this.connection.getMetadata(finalTarget);
                        databaseEntityLoader = new SubjectBuilder(this.connection, queryRunner);
                        return [4 /*yield*/, databaseEntityLoader.persist(entity, metadata)];
                    case 4:
                        _a.sent();
                        executor = new SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunner, databaseEntityLoader.operateSubjects);
                        executors_1.push(executor);
                        _a.label = 5;
                    case 5:
                        executorsNeedsToBeExecuted = executors_1.filter(function (executor) { return executor.areExecutableOperations(); });
                        if (!executorsNeedsToBeExecuted.length) return [3 /*break*/, 17];
                        isTransactionStartedByItself = false;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 12, , 17]);
                        if (!!queryRunner.isTransactionActive) return [3 /*break*/, 8];
                        isTransactionStartedByItself = true;
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, Promise.all(executorsNeedsToBeExecuted.map(function (executor) {
                            return executor.execute();
                        }))];
                    case 9:
                        _a.sent();
                        if (!(isTransactionStartedByItself === true)) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 17];
                    case 12:
                        error_1 = _a.sent();
                        if (!isTransactionStartedByItself) return [3 /*break*/, 16];
                        _a.label = 13;
                    case 13:
                        _a.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        rollbackError_2 = _a.sent();
                        return [3 /*break*/, 16];
                    case 16: throw error_1;
                    case 17: return [3 /*break*/, 21];
                    case 18:
                        if (!!this.queryRunner) return [3 /*break*/, 20];
                        return [4 /*yield*/, queryRunner.release()];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20: return [7 /*endfinally*/];
                    case 21: return [2 /*return*/, entity];
                }
            });
        }); });
    };
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    EntityManager.prototype.update = function (target, conditionsOrFindOptions, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(target, conditionsOrFindOptions)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a given criteria");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.save(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates entity partially. Entity will be found by a given id.
     */
    EntityManager.prototype.updateById = function (target, id, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(target, id)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a id");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.save(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a given entity from the database.
     */
    EntityManager.prototype.remove = function (targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        var _this = this;
        var target = (arguments.length > 1 && (targetOrEntity instanceof Function || typeof targetOrEntity === "string")) ? targetOrEntity : undefined;
        var entity = target ? maybeEntityOrOptions : targetOrEntity;
        var options = target ? maybeOptions : maybeEntityOrOptions;
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, transactionEntityManager, executors_2, finalTarget, metadata, databaseEntityLoader, executor, executorsNeedsToBeExecuted, isTransactionStartedByItself, error_2, rollbackError_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
                        transactionEntityManager = new EntityManagerFactory().create(this.connection, queryRunner);
                        if (options && options.data)
                            Object.assign(queryRunner.data, options.data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 18, 21]);
                        executors_2 = [];
                        if (!(entity instanceof Array)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(entity.map(function (entity) { return __awaiter(_this, void 0, void 0, function () {
                                var entityTarget, metadata, databaseEntityLoader, executor;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            entityTarget = target ? target : entity.constructor;
                                            metadata = this.connection.getMetadata(entityTarget);
                                            databaseEntityLoader = new SubjectBuilder(this.connection, queryRunner);
                                            return [4 /*yield*/, databaseEntityLoader.remove(entity, metadata)];
                                        case 1:
                                            _a.sent();
                                            executor = new SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunner, databaseEntityLoader.operateSubjects);
                                            executors_2.push(executor);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        finalTarget = target ? target : entity.constructor;
                        metadata = this.connection.getMetadata(finalTarget);
                        databaseEntityLoader = new SubjectBuilder(this.connection, queryRunner);
                        return [4 /*yield*/, databaseEntityLoader.remove(entity, metadata)];
                    case 4:
                        _a.sent();
                        executor = new SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunner, databaseEntityLoader.operateSubjects);
                        executors_2.push(executor);
                        _a.label = 5;
                    case 5:
                        executorsNeedsToBeExecuted = executors_2.filter(function (executor) { return executor.areExecutableOperations(); });
                        if (!executorsNeedsToBeExecuted.length) return [3 /*break*/, 17];
                        isTransactionStartedByItself = false;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 12, , 17]);
                        if (!!queryRunner.isTransactionActive) return [3 /*break*/, 8];
                        isTransactionStartedByItself = true;
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, Promise.all(executorsNeedsToBeExecuted.map(function (executor) {
                            return executor.execute();
                        }))];
                    case 9:
                        _a.sent();
                        if (!(isTransactionStartedByItself === true)) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 17];
                    case 12:
                        error_2 = _a.sent();
                        if (!isTransactionStartedByItself) return [3 /*break*/, 16];
                        _a.label = 13;
                    case 13:
                        _a.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        rollbackError_3 = _a.sent();
                        return [3 /*break*/, 16];
                    case 16: throw error_2;
                    case 17: return [3 /*break*/, 21];
                    case 18:
                        if (!!this.queryRunner) return [3 /*break*/, 20];
                        return [4 /*yield*/, queryRunner.release()];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20: return [7 /*endfinally*/];
                    case 21: return [2 /*return*/, entity];
                }
            });
        }); });
    };
    /**
     * Removes entity by a given entity id.
     */
    EntityManager.prototype.removeById = function (targetOrEntity, id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(targetOrEntity, id)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to remove by a given id");
                        return [4 /*yield*/, this.remove(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes entity by a given entity ids.
     */
    EntityManager.prototype.removeByIds = function (targetOrEntity, ids, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = ids.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var entity;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.findOneById(targetOrEntity, id)];
                                    case 1:
                                        entity = _a.sent();
                                        if (!entity)
                                            throw new Error("Cannot find entity to remove by a given id");
                                        return [4 /*yield*/, this.remove(entity, options)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Counts entities that match given find options or conditions.
     * Useful for pagination.
     */
    EntityManager.prototype.count = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getCount();
    };
    /**
     * Finds entities that match given find options or conditions.
     */
    EntityManager.prototype.find = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        this.joinEagerRelations(qb, qb.alias, metadata);
        return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getMany();
    };
    /**
     * Finds entities that match given find options and conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    EntityManager.prototype.findAndCount = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        this.joinEagerRelations(qb, qb.alias, metadata);
        return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getManyAndCount();
    };
    /**
     * Finds entities with ids.
     * Optionally find options or conditions can be applied.
     */
    EntityManager.prototype.findByIds = function (entityClass, ids, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        ids = ids.map(function (id) {
            if (!metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
                return metadata.createEntityIdMap([id]);
            }
            return id;
        });
        qb.whereInIds(ids);
        this.joinEagerRelations(qb, qb.alias, metadata);
        return qb.getMany();
    };
    /**
     * Finds first entity that matches given conditions.
     */
    EntityManager.prototype.findOne = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || metadata.name);
        this.joinEagerRelations(qb, qb.alias, metadata);
        return FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getOne();
    };
    /**
     * Finds entity with given id.
     * Optionally find options or conditions can be applied.
     */
    EntityManager.prototype.findOneById = function (entityClass, id, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || metadata.name);
        if (metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
            // const columnNames = this.metadata.getEntityIdMap({  });
            throw new Error("You have multiple primary keys in your entity, to use findOneById with multiple primary keys please provide " +
                "complete object with all entity ids, like this: { firstKey: value, secondKey: value }");
        }
        if (!metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
            id = metadata.createEntityIdMap([id]);
        }
        this.joinEagerRelations(qb, qb.alias, metadata);
        qb.whereInIds([id]);
        FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        return qb.getOne();
    };
    /**
     * Clears all the data from the given table (truncates/drops it).
     *
     * Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
     * @see https://stackoverflow.com/a/5972738/925151
     */
    EntityManager.prototype.clear = function (entityClass) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(entityClass);
                        queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 6]);
                        return [4 /*yield*/, queryRunner.truncate(metadata.tablePath)];
                    case 2: return [2 /*return*/, _a.sent()]; // await is needed here because we are using finally
                    case 3:
                        if (!!this.queryRunner) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.release()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    EntityManager.prototype.getRepository = function (target) {
        // throw exception if there is no repository with this target registered
        if (!this.connection.hasMetadata(target))
            throw new RepositoryNotFoundError(this.connection.name, target);
        // find already created repository instance and return it if found
        var metadata = this.connection.getMetadata(target);
        var repository = this.repositories.find(function (repository) { return repository.metadata === metadata; });
        if (repository)
            return repository;
        // if repository was not found then create it, store its instance and return it
        var newRepository = new RepositoryFactory().create(this, metadata, this.queryRunner);
        this.repositories.push(newRepository);
        return newRepository;
    };
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    EntityManager.prototype.getTreeRepository = function (target) {
        // tree tables aren't supported by some drivers (mongodb)
        if (this.connection.driver.treeSupport === false)
            throw new TreeRepositoryNotSupportedError(this.connection.driver);
        // check if repository is real tree repository
        var repository = this.getRepository(target);
        if (!(repository instanceof TreeRepository))
            throw new RepositoryNotTreeError(target);
        return repository;
    };
    /**
     * Gets mongodb repository for the given entity class or name.
     */
    EntityManager.prototype.getMongoRepository = function (entityClassOrName) {
        return this.connection.getMongoRepository(entityClassOrName);
    };
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    EntityManager.prototype.getCustomRepository = function (customRepository) {
        var entityRepositoryMetadataArgs = getMetadataArgsStorage().entityRepositories.find(function (repository) {
            return repository.target === (customRepository instanceof Function ? customRepository : customRepository.constructor);
        });
        if (!entityRepositoryMetadataArgs)
            throw new CustomRepositoryNotFoundError(customRepository);
        var entityMetadata = entityRepositoryMetadataArgs.entity ? this.connection.getMetadata(entityRepositoryMetadataArgs.entity) : undefined;
        var entityRepositoryInstance = new entityRepositoryMetadataArgs.target(this, entityMetadata);
        // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
        // however we need these properties for internal work of the class
        if (entityRepositoryInstance instanceof AbstractRepository) {
            if (!entityRepositoryInstance["manager"])
                entityRepositoryInstance["manager"] = this;
        }
        if (entityRepositoryInstance instanceof Repository) {
            if (!entityMetadata)
                throw new CustomRepositoryCannotInheritRepositoryError(customRepository);
            entityRepositoryInstance["manager"] = this;
            entityRepositoryInstance["metadata"] = entityMetadata;
        }
        return entityRepositoryInstance;
    };
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    EntityManager.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.queryRunner)
                    throw new NoNeedToReleaseEntityManagerError();
                return [2 /*return*/, this.queryRunner.release()];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Joins all eager relations recursively.
     */
    EntityManager.prototype.joinEagerRelations = function (qb, alias, metadata) {
        var _this = this;
        metadata.eagerRelations.forEach(function (relation) {
            var relationAlias = alias + "_" + relation.propertyPath.replace(".", "_");
            qb.leftJoinAndSelect(alias + "." + relation.propertyPath, relationAlias);
            _this.joinEagerRelations(qb, relationAlias, relation.inverseEntityMetadata);
        });
    };
    return EntityManager;
}());
export { EntityManager };

//# sourceMappingURL=EntityManager.js.map
