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
import { MissingPrimaryColumnError } from "../error/MissingPrimaryColumnError";
import { CircularRelationsError } from "../error/CircularRelationsError";
import { DepGraph } from "../util/DepGraph";
import { DataTypeNotSupportedError } from "../error/DataTypeNotSupportedError";
import { MongoDriver } from "../driver/mongodb/MongoDriver";
import { SqlServerDriver } from "../driver/sqlserver/SqlServerDriver";
import { MysqlDriver } from "../driver/mysql/MysqlDriver";
/// todo: add check if there are multiple tables with the same name
/// todo: add checks when generated column / table names are too long for the specific driver
// todo: type in function validation, inverse side function validation
// todo: check on build for duplicate names, since naming checking was removed from MetadataStorage
// todo: duplicate name checking for: table, relation, column, index, naming strategy, join tables/columns?
// todo: check if multiple tree parent metadatas in validator
// todo: tree decorators can be used only on closure table (validation)
// todo: throw error if parent tree metadata was not specified in a closure table
// todo: MetadataArgsStorage: type in function validation, inverse side function validation
// todo: MetadataArgsStorage: check on build for duplicate names, since naming checking was removed from MetadataStorage
// todo: MetadataArgsStorage: duplicate name checking for: table, relation, column, index, naming strategy, join tables/columns?
// todo: MetadataArgsStorage: check for duplicate targets too since this check has been removed too
/**
 * Validates built entity metadatas.
 */
var EntityMetadataValidator = /** @class */ (function () {
    function EntityMetadataValidator() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Validates all given entity metadatas.
     */
    EntityMetadataValidator.prototype.validateMany = function (entityMetadatas, driver) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                entityMetadatas.forEach(function (entityMetadata) { return _this.validate(entityMetadata, entityMetadatas, driver); });
                this.validateDependencies(entityMetadatas);
                this.validateEagerRelations(entityMetadatas);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Validates given entity metadata.
     */
    EntityMetadataValidator.prototype.validate = function (entityMetadata, allEntityMetadatas, driver) {
        // check if table metadata has an id
        if (!entityMetadata.isClassTableChild && !entityMetadata.primaryColumns.length && !entityMetadata.isJunction)
            throw new MissingPrimaryColumnError(entityMetadata);
        // validate if table is using inheritance it has a discriminator
        // also validate if discriminator values are not empty and not repeated
        if (entityMetadata.inheritanceType === "single-table") {
            if (!entityMetadata.discriminatorColumn)
                throw new Error("Entity " + entityMetadata.name + " using single-table inheritance, it should also have a discriminator column. Did you forget to put @DiscriminatorColumn decorator?");
            if (["", undefined, null].indexOf(entityMetadata.discriminatorValue) !== -1)
                throw new Error("Entity " + entityMetadata.name + " has empty discriminator value. Discriminator value should not be empty.");
            var sameDiscriminatorValueEntityMetadata = allEntityMetadatas.find(function (metadata) {
                return metadata !== entityMetadata && metadata.discriminatorValue === entityMetadata.discriminatorValue;
            });
            if (sameDiscriminatorValueEntityMetadata)
                throw new Error("Entities " + entityMetadata.name + " and " + sameDiscriminatorValueEntityMetadata.name + " as equal discriminator values. Make sure their discriminator values are not equal using @DiscriminatorValue decorator.");
        }
        entityMetadata.relationCounts.forEach(function (relationCount) {
            if (relationCount.relation.isManyToOne || relationCount.relation.isOneToOne)
                throw new Error("Relation count can not be implemented on ManyToOne or OneToOne relations.");
        });
        if (!(driver instanceof MongoDriver)) {
            entityMetadata.columns.forEach(function (column) {
                var normalizedColumn = driver.normalizeType(column);
                if (driver.supportedDataTypes.indexOf(normalizedColumn) === -1)
                    throw new DataTypeNotSupportedError(column, normalizedColumn, driver.options.type);
                if (column.length && driver.withLengthColumnTypes.indexOf(normalizedColumn) === -1)
                    throw new Error("Column " + column.propertyName + " of Entity " + entityMetadata.name + " does not support length property.");
            });
        }
        /* if (driver instanceof MysqlDriver) {
             const generatedColumns = entityMetadata.columns.filter(column => column.isGenerated && column.generationStrategy !== "uuid");
             if (generatedColumns.length > 1)
                 throw new Error(`Error in ${entityMetadata.name} entity. There can be only one auto-increment column in MySql table.`);
         }*/
        if (driver instanceof MysqlDriver) {
            var metadatasWithDatabase = allEntityMetadatas.filter(function (metadata) { return metadata.database; });
            if (metadatasWithDatabase.length === 0 && !driver.database)
                throw new Error("Database not specified");
        }
        if (driver instanceof SqlServerDriver) {
            var charsetColumns = entityMetadata.columns.filter(function (column) { return column.charset; });
            if (charsetColumns.length > 1)
                throw new Error("Character set specifying is not supported in Sql Server");
        }
        // validate relations
        entityMetadata.relations.forEach(function (relation) {
            // check join tables:
            // using JoinTable is possible only on one side of the many-to-many relation
            // todo(dima): fix
            // if (relation.joinTable) {
            //     if (!relation.isManyToMany)
            //         throw new UsingJoinTableIsNotAllowedError(entityMetadata, relation);
            //     // if there is inverse side of the relation, then check if it does not have join table too
            //     if (relation.hasInverseSide && relation.inverseRelation.joinTable)
            //         throw new UsingJoinTableOnlyOnOneSideAllowedError(entityMetadata, relation);
            // }
            // check join columns:
            // using JoinColumn is possible only on one side of the relation and on one-to-one, many-to-one relation types
            // first check if relation is one-to-one or many-to-one
            // todo(dima): fix
            /*if (relation.joinColumn) {

                // join column can be applied only on one-to-one and many-to-one relations
                if (!relation.isOneToOne && !relation.isManyToOne)
                    throw new UsingJoinColumnIsNotAllowedError(entityMetadata, relation);

                // if there is inverse side of the relation, then check if it does not have join table too
                if (relation.hasInverseSide && relation.inverseRelation.joinColumn && relation.isOneToOne)
                    throw new UsingJoinColumnOnlyOnOneSideAllowedError(entityMetadata, relation);

                // check if join column really has referenced column
                if (relation.joinColumn && !relation.joinColumn.referencedColumn)
                    throw new Error(`Join column does not have referenced column set`);

            }

            // if its a one-to-one relation and JoinColumn is missing on both sides of the relation
            // or its one-side relation without JoinColumn we should give an error
            if (!relation.joinColumn && relation.isOneToOne && (!relation.hasInverseSide || !relation.inverseRelation.joinColumn))
                throw new MissingJoinColumnError(entityMetadata, relation);*/
            // if its a many-to-many relation and JoinTable is missing on both sides of the relation
            // or its one-side relation without JoinTable we should give an error
            // todo(dima): fix it
            // if (!relation.joinTable && relation.isManyToMany && (!relation.hasInverseSide || !relation.inverseRelation.joinTable))
            //     throw new MissingJoinTableError(entityMetadata, relation);
            // todo: validate if its one-to-one and side which does not have join column MUST have inverse side
            // todo: validate if its many-to-many and side which does not have join table MUST have inverse side
            // todo: if there is a relation, and inverse side is specified only on one side, shall we give error
            // todo: with message like: "Inverse side is specified only on one side of the relationship. Specify on other side too to prevent confusion".
            // todo: add validation if there two entities with the same target, and show error message with description of the problem (maybe file was renamed/moved but left in output directory)
            // todo: check if there are multiple columns on the same column applied.
            // todo: check column type if is missing in relational databases (throw new Error(`Column type of ${type} cannot be determined.`);)
            // todo: include driver-specific checks. for example in mongodb empty prefixes are not allowed
            // todo: if multiple columns with same name - throw exception, including cases when columns are in embeds with same prefixes or without prefix at all
            // todo: if multiple primary key used, at least one of them must be unique or @Index decorator must be set on entity
            // todo: check if entity with duplicate names, some decorators exist
        });
        // make sure cascade remove is not set for both sides of relationships (can be set in OneToOne decorators)
        entityMetadata.relations.forEach(function (relation) {
            var isCircularCascadeRemove = relation.isCascadeRemove && relation.inverseRelation && relation.inverseRelation.isCascadeRemove;
            if (isCircularCascadeRemove)
                throw new Error("Relation " + entityMetadata.name + "#" + relation.propertyName + " and " + relation.inverseRelation.entityMetadata.name + "#" + relation.inverseRelation.propertyName + " both has cascade remove set. " +
                    "This may lead to unexpected circular removals. Please set cascade remove only from one side of relationship.");
        }); // todo: maybe better just deny removal from one to one relation without join column?
        entityMetadata.eagerRelations.forEach(function (relation) {
        });
    };
    /**
     * Validates dependencies of the entity metadatas.
     */
    EntityMetadataValidator.prototype.validateDependencies = function (entityMetadatas) {
        var graph = new DepGraph();
        entityMetadatas.forEach(function (entityMetadata) {
            graph.addNode(entityMetadata.name);
        });
        entityMetadatas.forEach(function (entityMetadata) {
            entityMetadata.relationsWithJoinColumns
                .filter(function (relation) { return !relation.isNullable; })
                .forEach(function (relation) {
                graph.addDependency(entityMetadata.name, relation.inverseEntityMetadata.name);
            });
        });
        try {
            graph.overallOrder();
        }
        catch (err) {
            throw new CircularRelationsError(err.toString().replace("Error: Dependency Cycle Found: ", ""));
        }
    };
    /**
     * Validates eager relations to prevent circular dependency in them.
     */
    EntityMetadataValidator.prototype.validateEagerRelations = function (entityMetadatas) {
        entityMetadatas.forEach(function (entityMetadata) {
            entityMetadata.eagerRelations.forEach(function (relation) {
                if (relation.inverseRelation && relation.inverseRelation.isEager)
                    throw new Error("Circular eager relations are disallowed. " +
                        (entityMetadata.targetName + "#" + relation.propertyPath + " contains \"eager: true\", and its inverse side ") +
                        (relation.inverseEntityMetadata.targetName + "#" + relation.inverseRelation.propertyPath + " contains \"eager: true\" as well.") +
                        " Remove \"eager: true\" from one side of the relation.");
            });
        });
    };
    return EntityMetadataValidator;
}());
export { EntityMetadataValidator };

//# sourceMappingURL=EntityMetadataValidator.js.map
